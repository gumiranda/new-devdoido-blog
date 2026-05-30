import { Elysia, t } from "elysia";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, debitCredit } from "../db/client";
import {
  run,
  channel,
  video,
  article,
  automationConfig,
  scheduleConfig,
  cronLog,
  moderationResult,
  wallet,
  googleConnection,
} from "../db/schema";
import { authGuard } from "../auth/guard";
import { buildPrompt } from "../lib/prompts";
import { env } from "../env";
import { encrypt, decrypt } from "../lib/encryption";

/* ──────── Pipeline helpers ──────── */

async function generateArticleFromVideo(
  vid: typeof video.$inferSelect,
  workspaceId: string,
): Promise<typeof article.$inferSelect | null> {
  const [config] = await db
    .select()
    .from(automationConfig)
    .where(eq(automationConfig.workspaceId, workspaceId))
    .limit(1);

  if (!config?.enabled) return null;
  if (!config.generateOnTranscript) return null;
  if (!vid.transcript) return null;

  // Debit credits first
  await debitCredit(workspaceId, "generate_article", 25, `Geração IA: ${vid.title.slice(0, 80)}`);

  const { system, user } = buildPrompt(
    config.promptTemplate,
    vid.transcript,
    vid.title,
    undefined,
  );

  let generated: any;
  if (env.ANTHROPIC_API_KEY) {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: config.model ?? "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!resp.ok) {
      console.error("Claude API error:", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json();
    const text = data.content?.[0]?.text ?? "";
    try {
      generated = JSON.parse(text);
    } catch {
      generated = { title: vid.title, contentHtml: text, excerpt: text.slice(0, 160) };
    }
  } else {
    // Stub: no API key configured
    generated = {
      title: vid.title,
      metaDescription: `Artigo gerado a partir do vídeo "${vid.title}".`,
      contentHtml: `<p>${vid.transcript?.slice(0, 500) ?? "Conteúdo em processamento..."}</p>`,
      excerpt: vid.transcript?.slice(0, 160) ?? "",
      answerBox: `Neste artigo, exploramos os principais pontos do vídeo "${vid.title}", trazendo insights práticos para desenvolvedores.`,
      faq: [{ question: "O que este artigo aborda?", answer: "Os principais tópicos discutidos no vídeo." }],
      tags: ["auto-generated"],
    };
  }

  const slug = generated.title
    ? generated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
    : `auto-${Date.now()}`;

  const [art] = await db
    .insert(article)
    .values({
      workspaceId,
      title: generated.title ?? vid.title,
      slug,
      contentHtml: generated.contentHtml ?? "",
      excerpt: generated.excerpt ?? "",
      source: "ia",
      sourceVideoId: vid.id,
      sourceLabel: vid.title,
      category: generated.tags?.[0] ?? "blog",
      status: config.autoPublish ? "published" : "draft",
      metaTitle: generated.metaTitle ?? generated.title ?? vid.title,
      metaDescription: generated.metaDescription ?? generated.excerpt?.slice(0, 160) ?? "",
      answerBox: generated.answerBox ?? "",
      faqJson: generated.faq ?? null,
      views: 0,
      indexState: "na",
      moderationStatus: config.autoPublish ? "not_checked" : "not_checked",
    })
    .returning();

  // Run moderation if auto-published
  if (config.autoPublish && art) {
    if (env.OPENAI_API_KEY) {
      try {
        const modResp = await fetch("https://api.openai.com/v1/moderations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: `${art.title}\n\n${art.contentHtml ?? ""}` }),
        });
        if (modResp.ok) {
          const modData = await modResp.json();
          const result = modData.results?.[0];
          const flagged = result?.flagged ?? false;
          const status = flagged ? "flagged" : "approved";
          await db.insert(moderationResult).values({
            articleId: art.id,
            status,
            provider: "openai",
            rawResultJson: result,
          });
          await db
            .update(article)
            .set({
              moderationStatus: status,
              moderationCheckedAt: new Date(),
              ...(flagged ? { status: "draft" } : {}),
            })
            .where(eq(article.id, art.id));
        }
      } catch {
        // Moderation failure shouldn't block publishing
      }
    }
  }

  return art;
}

/* ──────── Module ──────── */

export const runs = new Elysia({ prefix: "/runs" })
  .use(authGuard)
  .get("/", ({ workspaceId }) =>
    db.select().from(run).where(eq(run.workspaceId, workspaceId)).orderBy(desc(run.startedAt))
  )

  // Trigger full pipeline: YouTube sync → transcription → generation → publish
  .post("/trigger", async ({ workspaceId }) => {
    const [conf] = await db
      .select()
      .from(scheduleConfig)
      .where(eq(scheduleConfig.workspaceId, workspaceId))
      .limit(1);

    const channels = await db
      .select()
      .from(channel)
      .where(and(eq(channel.workspaceId, workspaceId), eq(channel.active, true)));

    const [runRow] = await db
      .insert(run)
      .values({
        workspaceId,
        status: "ok",
        channelsCount: channels.length,
        newVideos: 0,
        transcribedCount: 0,
        quotaUsed: 0,
      })
      .returning();

    // Step 1: Find videos ready for transcription
    const pendingVideos = await db
      .select()
      .from(video)
      .where(
        and(
          eq(video.workspaceId, workspaceId),
          eq(video.transcriptStatus, "pending"),
          eq(video.status, "queued"),
        )
      )
      .limit(conf?.quotaPerRun ?? 5);

    let transcribed = 0;
    let generated = 0;

    // Step 2: Transcribe
    if (env.GLADIA_API_KEY) {
      for (const vid of pendingVideos) {
        try {
          const videoUrl = `https://www.youtube.com/watch?v=${vid.youtubeVideoId ?? vid.id}`;
          const resp = await fetch("https://api.gladia.io/v2/transcription", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.GLADIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio_url: videoUrl, language_behaviour: "automatic single language" }),
          });
          if (resp.ok) {
            const data = await resp.json();
            // Gladia will call our webhook when done
            await db
              .update(video)
              .set({ transcriptStatus: "processing", status: "processing" })
              .where(eq(video.id, vid.id));
            transcribed++;
          }
        } catch {
          await db
            .update(video)
            .set({ transcriptStatus: "error", transcriptError: "Submission failed" })
            .where(eq(video.id, vid.id));
        }
      }
    }

    // Step 3: For videos already having transcripts (done), generate articles
    const readyVideos = await db
      .select()
      .from(video)
      .where(
        and(
          eq(video.workspaceId, workspaceId),
          eq(video.transcriptStatus, "done"),
          eq(video.status, "done"),
        )
      )
      .limit(conf?.quotaPerRun ?? 5);

    for (const vid of readyVideos) {
      try {
        const art = await generateArticleFromVideo(vid, workspaceId);
        if (art) generated++;
      } catch (err) {
        console.error("Generation failed for video", vid.id, err);
      }
    }

    // Update run
    await db
      .update(run)
      .set({
        transcribedCount: transcribed,
        newVideos: generated,
        finishedAt: new Date(),
        quotaUsed: transcribed + generated,
        status: "ok",
      })
      .where(eq(run.id, runRow.id));

    // Log
    await db.insert(cronLog).values({
      workspaceId,
      runId: runRow.id,
      status: "ok",
      message: `Transcribed ${transcribed}, generated ${generated} articles`,
    });

    return { transcribed, generated, runId: runRow.id };
  })

  // Generate preview from a specific video (M3.4 preview UX)
  .post(
    "/preview",
    async ({ workspaceId, body, status }) => {
      const [vid] = await db
        .select()
        .from(video)
        .where(and(eq(video.id, body.videoId), eq(video.workspaceId, workspaceId)))
        .limit(1);

      if (!vid) return status(404, "Video not found");
      if (!vid.transcript) return status(409, "Video has no transcript");

      const [config] = await db
        .select()
        .from(automationConfig)
        .where(eq(automationConfig.workspaceId, workspaceId))
        .limit(1);

      const { system, user } = buildPrompt(
        body.promptOverride ?? config?.promptTemplate,
        vid.transcript,
        vid.title,
      );

      if (!env.ANTHROPIC_API_KEY) {
        return { preview: system + "\n\n" + user, note: "Claude API not configured — showing prompt only" };
      }

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: config?.model ?? "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });

      if (!resp.ok) return status(502, "Claude API error");

      const data = await resp.json();
      const text = data.content?.[0]?.text ?? "";

      try {
        return { preview: JSON.parse(text), raw: text };
      } catch {
        return { preview: { contentHtml: text }, raw: text };
      }
    },
    {
      body: t.Object({
        videoId: t.String(),
        promptOverride: t.Optional(t.String()),
      }),
    }
  );
