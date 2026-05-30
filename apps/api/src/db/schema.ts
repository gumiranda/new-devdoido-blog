/**
 * Drizzle schema — Neon Postgres.
 *
 * Two groups:
 *  1. Better Auth tables (user/session/account/verification + organization plugin:
 *     organization/member/invitation). `organization` == "workspace" in domain terms.
 *     Field/property names MUST match Better Auth defaults (mirror of `@better-auth/cli generate`).
 *  2. Domain tables — all scoped by `workspaceId` (-> organization.id, which is TEXT).
 */
import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ───────────────────────── Better Auth: core ───────────────────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // organization plugin
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ──────────────── Better Auth: organization plugin (= workspace) ──────────────── */

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: text("metadata"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/* ───────────────────────── Enums (domain) ───────────────────────── */

export const googleConnStatus = pgEnum("google_conn_status", ["active", "expired", "revoked"]);
export const videoStatus = pgEnum("video_status", ["queued", "processing", "done", "error"]);
export const runStatus = pgEnum("run_status", ["ok", "partial", "error"]);
export const articleStatus = pgEnum("article_status", ["draft", "published", "archived"]);
export const articleSource = pgEnum("article_source", ["ia", "manual"]);
export const indexState = pgEnum("index_state", [
  "na",
  "indexed",
  "notindexed",
  "excluded",
  "unknown",
  "checking",
  "queued",
]);
export const moderationStatus = pgEnum("moderation_status", [
  "not_checked",
  "approved",
  "flagged",
  "needs_review",
  "blocked",
]);
export const moderationResultStatus = pgEnum("moderation_result_status", [
  "approved",
  "flagged",
  "needs_review",
  "blocked",
]);
export const scheduleFrequency = pgEnum("schedule_frequency", ["daily", "weekly", "monthly"]);
export const walletPlan = pgEnum("wallet_plan", ["free", "pro", "scale"]);
export const creditType = pgEnum("credit_type", ["income", "expense"]);
export const creditAction = pgEnum("credit_action", [
  "transcribe_minute",
  "generate_article",
  "index_check",
  "monthly_subscription",
  "recharge",
]);
export const creditCategory = pgEnum("credit_category", [
  "article",
  "transcribe",
  "index",
  "recharge",
  "subscription",
]);
export const paymentProvider = pgEnum("payment_provider", ["abacatepay", "stripe"]);
export const paymentKind = pgEnum("payment_kind", ["topup", "subscription"]);
export const paymentMethod = pgEnum("payment_method", ["pix", "card"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "failed", "canceled"]);
export const transcriptStatus = pgEnum("transcript_status", ["pending", "processing", "done", "error"]);
export const cronLogStatus = pgEnum("cron_log_status", ["ok", "partial", "error"]);

/* helper: workspace FK (organization.id is TEXT) */
const workspaceId = () =>
  text("workspace_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" });

/* ───────────────────────── Domain tables ───────────────────────── */

/** Blog/SaaS settings extending the Better Auth `organization` (1:1). */
export const workspaceSettings = pgTable("workspace_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId().unique(),
  blogSlug: text("blog_slug"),
  category: text("category"),
  color: text("color"),
  description: text("description"),
  website: text("website"),
  instagram: text("instagram"),
  coverUrl: text("cover_url"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Google account used as YouTube Data API credential (1:1 per workspace today). */
export const googleConnection = pgTable("google_connection", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  accountEmail: text("account_email").notNull(),
  avatarLetter: text("avatar_letter"),
  status: googleConnStatus("status").notNull().default("active"),
  // TODO: encrypt at rest before storing real tokens
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"), // Google access token ~1h; refresh is stubbed
  authorizedAt: timestamp("authorized_at").notNull().defaultNow(),
  tokenRenewedAt: timestamp("token_renewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const channel = pgTable("channel", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  // explicit: each channel is monitored via a specific Google account's quota
  googleConnectionId: uuid("google_connection_id")
    .notNull()
    .references(() => googleConnection.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  handle: text("handle"),
  youtubeChannelId: text("youtube_channel_id"),
  color: text("color"),
  letter: text("letter"),
  subscribers: integer("subscribers").notNull().default(0),
  lastVideoLabel: text("last_video_label"),
  lastSyncedAt: timestamp("last_synced_at"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const video = pgTable(
  "video",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: workspaceId(),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channel.id, { onDelete: "cascade" }),
    youtubeVideoId: text("youtube_video_id"),
    title: text("title").notNull(),
    durationSeconds: integer("duration_seconds"),
    publishedAt: timestamp("published_at"),
    wordCount: integer("word_count").notNull().default(0),
    status: videoStatus("status").notNull().default("queued"),
    transcript: text("transcript"),
    transcriptStatus: transcriptStatus("transcript_status").notNull().default("pending"),
    transcriptRetryCount: integer("transcript_retry_count").notNull().default(0),
    transcriptNextRetryAt: timestamp("transcript_next_retry_at"),
    transcriptError: text("transcript_error"),
    transcriptProvider: text("transcript_provider").notNull().default("gladia"),
    thumbGrad: text("thumb_grad"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    dedupPerWorkspace: uniqueIndex("video_ws_ytid").on(t.workspaceId, t.youtubeVideoId),
  })
);

export const run = pgTable("run", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  status: runStatus("status").notNull().default("ok"),
  channelsCount: integer("channels_count").notNull().default(0),
  newVideos: integer("new_videos").notNull().default(0),
  transcribedCount: integer("transcribed_count").notNull().default(0),
  durationSeconds: integer("duration_seconds"),
  quotaUsed: integer("quota_used").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const article = pgTable(
  "article",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: workspaceId(),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    slug: text("slug").notNull(),
    contentHtml: text("content_html"),
    excerpt: text("excerpt"),
    coverUrl: text("cover_url"),
    category: text("category"),
    status: articleStatus("status").notNull().default("draft"),
    source: articleSource("source").notNull().default("manual"),
    sourceVideoId: uuid("source_video_id").references(() => video.id, { onDelete: "set null" }),
    sourceLabel: text("source_label"),
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at"),
    // GSC indexation (embedded)
    indexState: indexState("index_state").notNull().default("na"),
    indexCoverage: text("index_coverage"),
    indexCrawledAt: timestamp("index_crawled_at"),
    indexCheckedAt: timestamp("index_checked_at"),
    // SEO/AEO (r1#1)
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    canonicalUrl: text("canonical_url"),
    ogImageUrl: text("og_image_url"),
    twitterCard: text("twitter_card"),
    schemaJson: jsonb("schema_json"),
    faqJson: jsonb("faq_json"),
    answerBox: text("answer_box"),
    // Moderation (embedded; mirrors latest moderation_result)
    moderationStatus: moderationStatus("moderation_status").notNull().default("not_checked"),
    moderationCheckedAt: timestamp("moderation_checked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugPerWorkspace: uniqueIndex("article_slug_per_ws").on(t.workspaceId, t.slug),
  })
);

/** Tags as first-class entity (not jsonb). */
export const articleTag = pgTable(
  "article_tag",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: workspaceId(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugPerWorkspace: uniqueIndex("tag_slug_per_ws").on(t.workspaceId, t.slug),
  })
);

export const articleTagRelation = pgTable(
  "article_tag_relation",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => article.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => articleTag.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.articleId, t.tagId] }),
  })
);

export const moderationResult = pgTable("moderation_result", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id")
    .notNull()
    .references(() => article.id, { onDelete: "cascade" }),
  status: moderationResultStatus("status").notNull(),
  provider: text("provider").notNull().default("openai"),
  rawResultJson: jsonb("raw_result_json"),
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const automationConfig = pgTable("automation_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId().unique(),
  enabled: boolean("enabled").notNull().default(false),
  promptTemplate: text("prompt_template"),
  model: text("model").notNull().default("claude-sonnet-4-5"),
  generateOnTranscript: boolean("generate_on_transcript").notNull().default(true),
  autoPublish: boolean("auto_publish").notNull().default(false),
  options: jsonb("options"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const scheduleConfig = pgTable("schedule_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId().unique(),
  frequency: scheduleFrequency("frequency").notNull().default("daily"),
  cronExpr: text("cron_expr").notNull().default("0 8 * * *"),
  timezone: text("timezone").notNull().default("America/Sao_Paulo"),
  quotaPerRun: integer("quota_per_run").notNull().default(0),
  nextRunAt: timestamp("next_run_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId().unique(),
  balance: integer("balance").notNull().default(0),
  plan: walletPlan("plan").notNull().default("free"),
  planRenewsAt: timestamp("plan_renews_at"),
  cardLast4: text("card_last4"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const creditTransaction = pgTable("credit_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  type: creditType("type").notNull(),
  action: creditAction("action").notNull(),
  category: creditCategory("category").notNull(),
  detail: text("detail"),
  amount: integer("amount").notNull(), // signed: negative = expense
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  provider: paymentProvider("provider").notNull(),
  kind: paymentKind("kind").notNull(),
  method: paymentMethod("method").notNull(),
  credits: integer("credits").notNull().default(0),
  amountCents: integer("amount_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  status: paymentStatus("status").notNull().default("pending"),
  externalId: text("external_id"),
  planName: text("plan_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

/** Execution log for scheduled runs and integration jobs (r1#9 / r2#3). */
export const cronLog = pgTable("cron_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: workspaceId(),
  runId: uuid("run_id").references(() => run.id, { onDelete: "set null" }),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  status: cronLogStatus("status").notNull().default("ok"),
  quotaRemaining: integer("quota_remaining"),
  quotaResetAt: timestamp("quota_reset_at"),
  message: text("message"),
  contextJson: jsonb("context_json"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
