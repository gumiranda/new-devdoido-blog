/**
 * Seed — ports the frontend MOCK (`apps/landing/src/lib/mock.ts`) into the DB.
 * User is created via Better Auth (password hashing); domain rows via Drizzle.
 * Idempotent: reuses the existing user/org and wipes that workspace's domain rows.
 *
 * Run: `bun run db:seed`
 */
import { eq } from "drizzle-orm";
import { auth } from "../auth/auth";
import { db } from "./client";
import * as s from "./schema";

const EMAIL = "gustavo@faturei.io";
const PASSWORD = "devdoido123";
const NAME = "Gustavo Miranda";
const ORG_SLUG = "devdoido";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

async function ensureUser(): Promise<string> {
  try {
    const res = await auth.api.signUpEmail({ body: { email: EMAIL, password: PASSWORD, name: NAME } });
    return (res as { user: { id: string } }).user.id;
  } catch {
    const [u] = await db.select({ id: s.user.id }).from(s.user).where(eq(s.user.email, EMAIL)).limit(1);
    if (!u) throw new Error("could not create or find seed user");
    return u.id;
  }
}

async function ensureOrg(userId: string): Promise<string> {
  const [existing] = await db
    .select({ id: s.organization.id })
    .from(s.organization)
    .where(eq(s.organization.slug, ORG_SLUG))
    .limit(1);
  if (existing) return existing.id;

  const id = crypto.randomUUID();
  await db.insert(s.organization).values({ id, name: "DEVDOIDO", slug: ORG_SLUG });
  await db.insert(s.member).values({ id: crypto.randomUUID(), organizationId: id, userId, role: "owner" });
  return id;
}

async function wipe(ws: string) {
  // article delete cascades to article_tag_relation + moderation_result
  await db.delete(s.article).where(eq(s.article.workspaceId, ws));
  await db.delete(s.articleTag).where(eq(s.articleTag.workspaceId, ws));
  await db.delete(s.video).where(eq(s.video.workspaceId, ws));
  await db.delete(s.channel).where(eq(s.channel.workspaceId, ws));
  await db.delete(s.googleConnection).where(eq(s.googleConnection.workspaceId, ws));
  await db.delete(s.run).where(eq(s.run.workspaceId, ws));
  await db.delete(s.creditTransaction).where(eq(s.creditTransaction.workspaceId, ws));
  await db.delete(s.payment).where(eq(s.payment.workspaceId, ws));
  await db.delete(s.wallet).where(eq(s.wallet.workspaceId, ws));
  await db.delete(s.automationConfig).where(eq(s.automationConfig.workspaceId, ws));
  await db.delete(s.scheduleConfig).where(eq(s.scheduleConfig.workspaceId, ws));
  await db.delete(s.workspaceSettings).where(eq(s.workspaceSettings.workspaceId, ws));
}

async function main() {
  const userId = await ensureUser();
  const ws = await ensureOrg(userId);
  await wipe(ws);

  await db.insert(s.workspaceSettings).values({
    workspaceId: ws,
    blogSlug: ORG_SLUG,
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
    { workspaceId: ws, channelId: chByName["Rocketseat"], title: "Next.js 16: o que muda na prática", durationSeconds: 1104, wordCount: 3412, status: "done", publishedAt: daysAgo(1) },
    { workspaceId: ws, channelId: chByName["Filipe Deschamps"], title: "Construindo um sistema de filas do zero", durationSeconds: 2512, wordCount: 7220, status: "processing", publishedAt: daysAgo(1) },
    { workspaceId: ws, channelId: chByName["Código Fonte TV"], title: "O que é Clean Architecture de verdade", durationSeconds: 930, wordCount: 2890, status: "done", publishedAt: daysAgo(2) },
    { workspaceId: ws, channelId: chByName["Código Fonte TV"], title: "TypeScript avançado: generics na prática", durationSeconds: 1185, wordCount: 0, status: "queued", publishedAt: daysAgo(4) },
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
      { workspaceId: ws, authorId: userId, title: "Next.js 16 na prática: o novo cache que finalmente faz sentido", slug: "nextjs-16-cache", status: "draft", source: "ia", category: "Next.js", sourceLabel: "Rocketseat", views: 0, indexState: "na" },
      { workspaceId: ws, authorId: userId, title: "Se o Cursor cair, você sabe codar?", slug: "cursor-cair-saber-codar", status: "published", source: "manual", category: "Carreira", views: 2400, indexState: "indexed", indexCoverage: "URL enviada e indexada", publishedAt: daysAgo(2), moderationStatus: "approved", moderationCheckedAt: daysAgo(2) },
      { workspaceId: ws, authorId: userId, title: "Clean Architecture de verdade: o guia sem hype", slug: "clean-architecture-guia", status: "published", source: "ia", category: "Arquitetura", sourceLabel: "Código Fonte TV", views: 1820, indexState: "notindexed", indexCoverage: "Descoberta — não indexada no momento", publishedAt: daysAgo(2), moderationStatus: "approved" },
    ])
    .returning();
  const artBySlug = Object.fromEntries(artRows.map((a) => [a.slug, a.id]));

  await db.insert(s.articleTagRelation).values([
    { articleId: artBySlug["nextjs-16-cache"], tagId: tagBySlug["nextjs"] },
    { articleId: artBySlug["cursor-cair-saber-codar"], tagId: tagBySlug["carreira"] },
    { articleId: artBySlug["clean-architecture-guia"], tagId: tagBySlug["arquitetura"] },
  ]);

  await db.insert(s.wallet).values({ workspaceId: ws, balance: 1240, plan: "pro", planRenewsAt: new Date(Date.now() + 16 * 86_400_000), cardLast4: "4242" });

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

  console.log(`✓ Seeded workspace ${ws} (user ${EMAIL} / ${PASSWORD})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
