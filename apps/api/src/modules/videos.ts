import { Elysia, t } from "elysia";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { video } from "../db/schema";
import { authGuard } from "../auth/guard";
import { env } from "../env";

export const videos = new Elysia({ prefix: "/videos" })
  .use(authGuard)
  .get(
    "/",
    ({ workspaceId, query }) => {
      const conds = [eq(video.workspaceId, workspaceId)];
      if (query.channel) conds.push(eq(video.channelId, query.channel));
      if (query.transcriptStatus)
        conds.push(eq(video.transcriptStatus, query.transcriptStatus as never));
      return db.select().from(video).where(and(...conds)).orderBy(desc(video.publishedAt));
    },
    { query: t.Object({ channel: t.Optional(t.String()), transcriptStatus: t.Optional(t.String()) }) }
  )
  .get("/:id/transcript", async ({ workspaceId, params, status }) => {
    const [row] = await db
      .select({
        id: video.id,
        title: video.title,
        status: video.status,
        transcript: video.transcript,
        transcriptStatus: video.transcriptStatus,
        transcriptError: video.transcriptError,
        transcriptProvider: video.transcriptProvider,
        transcriptRetryCount: video.transcriptRetryCount,
      })
      .from(video)
      .where(and(eq(video.id, params.id), eq(video.workspaceId, workspaceId)))
      .limit(1);
    if (!row) return status(404, "Video not found");
    if (row.status !== "done") return status(409, "Transcript not ready");
    return row;
  })
  // Retry transcript (r2#1) — reset to pending so the cron worker picks it up
  .post("/:id/retry-transcript", async ({ workspaceId, params, status }) => {
    const [row] = await db
      .select({ id: video.id, transcriptStatus: video.transcriptStatus })
      .from(video)
      .where(and(eq(video.id, params.id), eq(video.workspaceId, workspaceId)))
      .limit(1);
    if (!row) return status(404, "Video not found");
    if (row.transcriptStatus !== "error")
      return status(409, "Only errored transcripts can be retried");

    await db
      .update(video)
      .set({ transcriptStatus: "pending", transcriptError: null })
      .where(eq(video.id, params.id));
    return { ok: true };
  })

  // Submit video for transcription via Gladia (M3.2)
  .post("/:id/transcribe", async ({ workspaceId, params, status }) => {
    if (!env.GLADIA_API_KEY) return status(503, "Transcription service not configured");

    const [row] = await db
      .select()
      .from(video)
      .where(and(eq(video.id, params.id), eq(video.workspaceId, workspaceId)))
      .limit(1);

    if (!row) return status(404, "Video not found");
    if (!row.youtubeVideoId) return status(400, "Video has no YouTube ID");

    const videoUrl = `https://www.youtube.com/watch?v=${row.youtubeVideoId}`;

    try {
      await db
        .update(video)
        .set({ transcriptStatus: "processing", transcriptError: null })
        .where(eq(video.id, row.id));

      const resp = await fetch("https://api.gladia.io/v2/transcription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GLADIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: videoUrl,
          language_behaviour: "automatic single language",
          transcription_hint: "pt",
        }),
      });

      if (!resp.ok) {
        const err = await resp.text();
        await db
          .update(video)
          .set({
            transcriptStatus: "error",
            transcriptError: `Gladia error: ${resp.status} ${err.slice(0, 200)}`,
          })
          .where(eq(video.id, row.id));
        return status(502, "Transcription service error");
      }

      const data = await resp.json();
      return { id: data.id, status: "processing" };
    } catch (err: any) {
      await db
        .update(video)
        .set({
          transcriptStatus: "error",
          transcriptError: err.message ?? "Unknown error",
          transcriptRetryCount: (row.transcriptRetryCount ?? 0) + 1,
        })
        .where(eq(video.id, row.id));
      return status(500, "Failed to submit transcription");
    }
  });
