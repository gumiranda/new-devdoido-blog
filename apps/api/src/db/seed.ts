/**
 * Seed + reusable bootstrap helpers.
 *
 * - `bootstrapWorkspace()` — creates user + org + member + defaults (wallet,
 *   settings, automation, schedule). Exportable for signup hooks (M4).
 * - `backfillArticleSeo()` — backfills metaTitle/metaDescription for articles
 *   that lack them (safe post-migration job, M0.8).
 *
 * Seed commmand: `bun run db:seed`
 * Backfill command: `bun run src/db/seed.ts backfill`
 */
import { eq } from "drizzle-orm";
import { auth } from "../auth/auth";
import { db } from "./client";
import * as s from "./schema";
import { PLAN_CREDITS } from "../lib/plans";

const SEED_EMAIL = "gustavo@faturei.io";
const SEED_PASSWORD = "devdoido123";
const SEED_NAME = "Gustavo Miranda";
const SEED_ORG_SLUG = "devdoido";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

/* ──────── Reusable bootstrap (M0.7 / M1.5 / M4.1) ──────── */

export interface BootstrapInput {
  email: string;
  password: string;
  name: string;
  orgSlug: string;
  orgName: string;
  /** Plan name — defaults come from PLANS table. */
  plan?: "free" | "pro" | "scale";
}

export interface BootstrapResult {
  userId: string;
  workspaceId: string;
}

/**
 * Create user + org + member + all default workspace rows in one shot.
 * Idempotent: if the email already exists, reuses the existing user.
 * If the org slug already exists, reuses the existing org.
 * Safe to call from Better Auth `databaseHooks.user.create` (M4.1).
 */
export async function bootstrapWorkspace(input: BootstrapInput): Promise<BootstrapResult> {
  const plan = input.plan ?? "free";

  // 1. User
  let userId: string;
  try {
    const res = await auth.api.signUpEmail({
      body: { email: input.email, password: input.password, name: input.name },
    });
    userId = (res as { user: { id: string } }).user.id;
  } catch {
    const [u] = await db.select({ id: s.user.id }).from(s.user).where(eq(s.user.email, input.email)).limit(1);
    if (!u) throw new Error("could not create or find user");
    userId = u.id;
  }

  // 2. Org + membership
  let wsId: string;
  const [existing] = await db
    .select({ id: s.organization.id })
    .from(s.organization)
    .where(eq(s.organization.slug, input.orgSlug))
    .limit(1);
  if (existing) {
    wsId = existing.id;
  } else {
    wsId = crypto.randomUUID();
    await db.insert(s.organization).values({ id: wsId, name: input.orgName, slug: input.orgSlug });
    await db.insert(s.member).values({
      id: crypto.randomUUID(),
      organizationId: wsId,
      userId,
      role: "owner",
    });
  }

  // 3. Default workspace rows (upsert — safe on re-seed)
  await db
    .insert(s.workspaceSettings)
    .values({ workspaceId: wsId, blogSlug: input.orgSlug })
    .onConflictDoUpdate({ target: s.workspaceSettings.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.wallet)
    .values({ workspaceId: wsId, balance: PLAN_CREDITS[plan], plan })
    .onConflictDoUpdate({ target: s.wallet.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.automationConfig)
    .values({
      workspaceId: wsId,
      enabled: false,
      model: "claude-sonnet-4-5",
      generateOnTranscript: true,
      autoPublish: false,
      promptTemplate:
        "Você é um redator técnico especializado em SEO. Escreva um artigo de blog em português brasileiro a partir da transcrição abaixo. O artigo deve ter título H1 cativante, meta description (max 160 chars), subtítulos H2, parágrafos curtos (max 4 linhas), bullets quando couber, e uma seção de FAQ com 3 perguntas no final. Use tom informal mas profissional. Inclua uma caixa de resposta rápida (answer box) de 40-80 palavras no início resumindo o artigo.\n\nTranscrição:\n{{transcript}}",
    })
    .onConflictDoUpdate({ target: s.automationConfig.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.scheduleConfig)
    .values({
      workspaceId: wsId,
      frequency: "daily",
      cronExpr: "0 8 * * *",
      timezone: "America/Sao_Paulo",
      quotaPerRun: plan === "free" ? 5 : plan === "pro" ? 100 : 500,
    })
    .onConflictDoUpdate({ target: s.scheduleConfig.workspaceId, set: { updatedAt: new Date() } });

  return { userId, workspaceId: wsId };
}

/* ──────── Backfill (M0.8) ──────── */

/**
 * Backfill SEO fields for articles that are missing metaTitle/metaDescription.
 * metaDescription ← excerpt || contentText.slice(0, 160)
 * metaTitle ← title
 * Safe to run multiple times (idempotent).
 * Call after migration in staging → validate → run in production.
 */
export async function backfillArticleSeo() {
  const rows = await db.select().from(s.article).where(eq(s.article.metaTitle, null as any));

  for (const row of rows) {
    const metaDescription = row.excerpt
      ?? row.metaDescription
      ?? (() => {
          const text = row.contentHtml?.replace(/<[^>]+>/g, "") ?? "";
          return text.slice(0, 160);
        })();

    await db
      .update(s.article)
      .set({
        metaTitle: row.title,
        metaDescription,
        ogImageUrl: row.coverUrl,
        twitterCard: "summary_large_image",
        updatedAt: new Date(),
      })
      .where(eq(s.article.id, row.id));
  }

  console.log(`✓ Backfilled ${rows.length} articles`);
}

/* ──────── Seed main (development fixtures) ──────── */

async function wipe(ws: string) {
  await db.delete(s.article).where(eq(s.article.workspaceId, ws));
  await db.delete(s.articleTag).where(eq(s.articleTag.workspaceId, ws));
  await db.delete(s.video).where(eq(s.video.workspaceId, ws));
  await db.delete(s.channel).where(eq(s.channel.workspaceId, ws));
  await db.delete(s.googleConnection).where(eq(s.googleConnection.workspaceId, ws));
  await db.delete(s.run).where(eq(s.run.workspaceId, ws));
  await db.delete(s.cronLog).where(eq(s.cronLog.workspaceId, ws));
  await db.delete(s.creditTransaction).where(eq(s.creditTransaction.workspaceId, ws));
  await db.delete(s.payment).where(eq(s.payment.workspaceId, ws));
  await db.delete(s.wallet).where(eq(s.wallet.workspaceId, ws));
  await db.delete(s.automationConfig).where(eq(s.automationConfig.workspaceId, ws));
  await db.delete(s.scheduleConfig).where(eq(s.scheduleConfig.workspaceId, ws));
  await db.delete(s.workspaceSettings).where(eq(s.workspaceSettings.workspaceId, ws));
}

async function seed() {
  const { userId, workspaceId: ws } = await bootstrapWorkspace({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    name: SEED_NAME,
    orgSlug: SEED_ORG_SLUG,
    orgName: "DEVDOIDO",
    plan: "pro",
  });

  await wipe(ws);

  // Re-insert post-wipe (wallet + automation + schedule)
  await db.insert(s.wallet).values({ workspaceId: ws, balance: 1240, plan: "pro", planRenewsAt: new Date(Date.now() + 16 * 86_400_000), cardLast4: "4242" });

  await db.insert(s.workspaceSettings).values({
    workspaceId: ws,
    blogSlug: SEED_ORG_SLUG,
    category: "blog",
    color: "hsl(217 91% 55%)",
    description: "Blog sobre programação, IA, SaaS e carreira dev.",
    website: "https://devdoido.com.br",
    instagram: "@devdoido",
  });

  const [conn] = await db
    .insert(s.googleConnection)
    .values({ workspaceId: ws, accountEmail: "devdoido.bot@gmail.com", avatarLetter: "D", status: "active", tokenExpiresAt: new Date(Date.now() + 3_600_000) })
    .returning();

  const channelsData = [
    { name: "Rocketseat", handle: "@rocketseat", youtubeChannelId: "UCSfwM5u0Kf33Bnzwd9rocket", letter: "R", subscribers: 2_100_000, active: true },
    { name: "Filipe Deschamps", handle: "@FilipeDeschamps", youtubeChannelId: "UCRWqwD1", letter: "F", subscribers: 1_600_000, active: true },
    { name: "Código Fonte TV", handle: "@codigofontetv", youtubeChannelId: "UClbYj", letter: "C", subscribers: 1_200_000, active: false },
  ];
  const insertedChannels = await db
    .insert(s.channel)
    .values(channelsData.map((c) => ({ workspaceId: ws, googleConnectionId: conn.id, lastVideoLabel: "capturado hoje 08:00", ...c })))
    .returning();
  const chByName = Object.fromEntries(insertedChannels.map((c) => [c.name, c.id]));

  await db.insert(s.video).values([
    { workspaceId: ws, channelId: chByName["Rocketseat"], youtubeVideoId: "vid_r_nextjs16", title: "Next.js 16: o que muda na prática", durationSeconds: 1104, wordCount: 3412, status: "done", transcriptStatus: "done", publishedAt: daysAgo(1) },
    { workspaceId: ws, channelId: chByName["Filipe Deschamps"], youtubeVideoId: "vid_f_filas", title: "Construindo um sistema de filas do zero", durationSeconds: 2512, wordCount: 7220, status: "processing", transcriptStatus: "processing", publishedAt: daysAgo(1) },
    { workspaceId: ws, channelId: chByName["Código Fonte TV"], youtubeVideoId: "vid_c_clean", title: "O que é Clean Architecture de verdade", durationSeconds: 930, wordCount: 2890, status: "done", transcriptStatus: "done", publishedAt: daysAgo(2) },
    { workspaceId: ws, channelId: chByName["Código Fonte TV"], youtubeVideoId: "vid_c_tsgen", title: "TypeScript avançado: generics na prática", durationSeconds: 1185, wordCount: 0, status: "queued", transcriptStatus: "pending", publishedAt: daysAgo(4) },
  ]);

  await db.insert(s.run).values([
    { workspaceId: ws, status: "ok", channelsCount: 3, newVideos: 6, transcribedCount: 6, durationSeconds: 134, quotaUsed: 412, startedAt: daysAgo(0) },
    { workspaceId: ws, status: "ok", channelsCount: 3, newVideos: 4, transcribedCount: 4, durationSeconds: 112, startedAt: daysAgo(1) },
    { workspaceId: ws, status: "partial", channelsCount: 3, newVideos: 5, transcribedCount: 3, durationSeconds: 220, startedAt: daysAgo(2) },
  ]);

  const tagRows = await db
    .insert(s.articleTag)
    .values([
      { workspaceId: ws, name: "Next.js", slug: "nextjs" },
      { workspaceId: ws, name: "Node.js", slug: "nodejs" },
      { workspaceId: ws, name: "Carreira", slug: "carreira" },
      { workspaceId: ws, name: "Arquitetura", slug: "arquitetura" },
    ])
    .returning();
  const tagBySlug = Object.fromEntries(tagRows.map((t) => [t.slug, t.id]));

  const artRows = await db
    .insert(s.article)
    .values([
      {
        workspaceId: ws, authorId: userId,
        title: "Next.js 16 na prática: o novo cache que finalmente faz sentido",
        slug: "nextjs-16-cache", status: "draft", source: "ia", category: "Next.js",
        sourceLabel: "Rocketseat", views: 0, indexState: "na",
        metaTitle: "Next.js 16 na prática: o novo cache que finalmente faz sentido",
        metaDescription: "Entenda como o novo sistema de cache do Next.js 16 muda a forma de pensar sobre SSR, ISR e edge rendering.",
        twitterCard: "summary_large_image",
      },
      {
        workspaceId: ws, authorId: userId,
        title: "Se o Cursor cair, você sabe codar?",
        slug: "cursor-cair-saber-codar", status: "published", source: "manual", category: "Carreira",
        views: 2400, indexState: "indexed", indexCoverage: "URL enviada e indexada",
        publishedAt: daysAgo(2), moderationStatus: "approved", moderationCheckedAt: daysAgo(2),
        metaTitle: "Se o Cursor cair, você sabe codar? — DEVDOIDO",
        metaDescription: "Ferramentas de IA caem. O mercado muda. A pergunta que separa dev junior de senior é: você consegue entregar sem autocomplete?",
        twitterCard: "summary_large_image",
        answerBox: "Ferramentas de IA como Cursor e Copilot são aceleradores, não substitutos. Saber codar sem elas é o que garante sua empregabilidade no longo prazo — e o que diferencia quem entrega de quem só cola.",
        faqJson: {
          questions: [
            { question: "Cursor pode substituir um desenvolvedor?", answer: "Não. Cursor é um acelerador para quem já sabe o que está fazendo. Para quem não sabe, ele gera código que você não consegue debugar." },
            { question: "O que estudar para não depender de IA?", answer: "Fundamentos: algoritmos, estrutura de dados, padrões de projeto, arquitetura de software. Saber explicar por que seu código funciona, não só que ele funciona." },
            { question: "Vale a pena usar Cursor no dia a dia?", answer: "Sim, se você usa como par: pede em pedaços, revisa tudo, e nunca aceita código que você não entendeu." },
          ],
        },
      },
      {
        workspaceId: ws, authorId: userId,
        title: "Clean Architecture de verdade: o guia sem hype",
        slug: "clean-architecture-guia", status: "published", source: "ia", category: "Arquitetura",
        sourceLabel: "Código Fonte TV", views: 1820, indexState: "notindexed",
        indexCoverage: "Descoberta — não indexada no momento", publishedAt: daysAgo(2),
        moderationStatus: "approved",
        metaTitle: "Clean Architecture de verdade: o guia sem hype — DEVDOIDO",
        metaDescription: "Clean Architecture não é sobre pastas. É sobre dependências apontando pra dentro. Veja como aplicar sem cair no overengineering que os gurus vendem.",
        twitterCard: "summary_large_image",
      },
    ])
    .returning();
  const artBySlug = Object.fromEntries(artRows.map((a) => [a.slug, a.id]));

  await db.insert(s.articleTagRelation).values([
    { articleId: artBySlug["nextjs-16-cache"], tagId: tagBySlug["nextjs"] },
    { articleId: artBySlug["cursor-cair-saber-codar"], tagId: tagBySlug["carreira"] },
    { articleId: artBySlug["clean-architecture-guia"], tagId: tagBySlug["arquitetura"] },
  ]);

  await db.insert(s.creditTransaction).values([
    { workspaceId: ws, type: "expense", action: "generate_article", category: "article", detail: 'Geração de artigo · "Next.js 16 na prática"', amount: -25 },
    { workspaceId: ws, type: "expense", action: "transcribe_minute", category: "transcribe", detail: "Transcrição · 6 vídeos", amount: -60 },
    { workspaceId: ws, type: "income", action: "recharge", category: "recharge", detail: "Recarga via Pix · Abacate Pay", amount: 5000 },
    { workspaceId: ws, type: "income", action: "monthly_subscription", category: "subscription", detail: "Renovação mensal · plano Pro", amount: 3000 },
  ]);

  await db.insert(s.automationConfig).values({
    workspaceId: ws,
    enabled: true,
    model: "claude-sonnet-4-5",
    generateOnTranscript: true,
    autoPublish: false,
    promptTemplate: "Escreva um artigo de blog a partir da transcrição do vídeo {{transcript}}.",
  });

  await db.insert(s.scheduleConfig).values({
    workspaceId: ws,
    frequency: "daily",
    cronExpr: "0 8 * * *",
    timezone: "America/Sao_Paulo",
    quotaPerRun: 412,
    nextRunAt: new Date(Date.now() + 14 * 3_600_000),
  });

  console.log(`✓ Seeded workspace ${ws} (user ${SEED_EMAIL} / ${SEED_PASSWORD})`);
}

/* ──────── Entry ──────── */

const cmd = process.argv[2];

if (cmd === "backfill") {
  backfillArticleSeo()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
