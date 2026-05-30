import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  uuid,
  varchar,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ── Enums ── */

export const videoStatusEnum = pgEnum('video_status', ['queued', 'processing', 'done', 'error']);
export const runStatusEnum = pgEnum('run_status', ['ok', 'partial', 'error']);
export const articleStatusEnum = pgEnum('article_status', ['draft', 'published', 'archived']);
export const articleSourceEnum = pgEnum('article_source', ['ia', 'manual']);
export const indexStateEnum = pgEnum('index_state', ['na', 'indexed', 'notindexed', 'excluded', 'unknown', 'checking', 'queued']);
export const moderationStatusEnum = pgEnum('moderation_status', ['not_checked', 'approved', 'flagged', 'needs_review', 'blocked']);
export const scheduleFrequencyEnum = pgEnum('schedule_frequency', ['daily', 'hours', 'weekly']);
export const walletPlanEnum = pgEnum('wallet_plan', ['free', 'pro', 'scale']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const transactionActionEnum = pgEnum('transaction_action', ['transcribe_minute', 'generate_article', 'index_check', 'monthly_subscription', 'recharge']);
export const transactionCategoryEnum = pgEnum('transaction_category', ['article', 'transcribe', 'index', 'recharge', 'subscription']);
export const paymentProviderEnum = pgEnum('payment_provider', ['abacatepay', 'stripe']);
export const paymentKindEnum = pgEnum('payment_kind', ['topup', 'subscription']);
export const paymentMethodEnum = pgEnum('payment_method', ['pix', 'card']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'canceled']);

/* ── Better Auth tables ── */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull(),
  status: text('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

/* ── Domain tables ── */

export const workspaceSettings = pgTable('workspace_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().unique().references(() => organization.id, { onDelete: 'cascade' }),
  blogSlug: text('blog_slug').notNull(),
  category: text('category').notNull().default('blog'),
  color: text('color').notNull().default('hsl(217 91% 55%)'),
  description: text('description'),
  website: text('website'),
  instagram: text('instagram'),
  coverUrl: text('cover_url'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const googleConnection = pgTable('google_connection', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().unique().references(() => organization.id, { onDelete: 'cascade' }),
  accountEmail: text('account_email').notNull(),
  avatarLetter: text('avatar_letter').notNull().default('G'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  authorizedAt: timestamp('authorized_at'),
  tokenRenewedAt: timestamp('token_renewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const channel = pgTable('channel', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  googleConnectionId: uuid('google_connection_id').notNull().references(() => googleConnection.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  youtubeChannelId: text('youtube_channel_id'),
  color: text('color').notNull().default('linear-gradient(135deg,#8257e6,#6420aa)'),
  letter: text('letter').notNull().default('C'),
  subscribers: integer('subscribers').notNull().default(0),
  lastVideoLabel: text('last_video_label'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const video = pgTable('video', {
  id: uuid('id').defaultRandom().primaryKey(),
  channelId: uuid('channel_id').notNull().references(() => channel.id, { onDelete: 'cascade' }),
  youtubeVideoId: text('youtube_video_id'),
  title: text('title').notNull(),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  publishedAt: timestamp('published_at'),
  wordCount: integer('word_count').notNull().default(0),
  status: videoStatusEnum('status').notNull().default('queued'),
  transcript: text('transcript'),
  thumbGrad: text('thumb_grad'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const run = pgTable('run', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at').notNull(),
  finishedAt: timestamp('finished_at'),
  status: runStatusEnum('status').notNull().default('ok'),
  channelsCount: integer('channels_count').notNull().default(0),
  newVideos: integer('new_videos').notNull().default(0),
  transcribedCount: integer('transcribed_count').notNull().default(0),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  quotaUsed: integer('quota_used').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const article = pgTable('article', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  slug: text('slug').notNull(),
  contentHtml: text('content_html'),
  excerpt: text('excerpt'),
  coverUrl: text('cover_url'),
  category: text('category'),
  status: articleStatusEnum('status').notNull().default('draft'),
  source: articleSourceEnum('source').notNull().default('manual'),
  sourceVideoId: uuid('source_video_id').references(() => video.id, { onDelete: 'set null' }),
  sourceLabel: text('source_label'),
  gradient: text('gradient'),
  letter: text('letter'),
  views: integer('views').notNull().default(0),
  publishedAt: timestamp('published_at'),
  indexState: indexStateEnum('index_state').notNull().default('na'),
  indexCoverage: text('index_coverage'),
  indexCrawledAt: timestamp('index_crawled_at'),
  indexCheckedAt: timestamp('index_checked_at'),
  moderationStatus: moderationStatusEnum('moderation_status').notNull().default('not_checked'),
  moderationCheckedAt: timestamp('moderation_checked_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  slugUnique: uniqueIndex('article_slug_unique').on(t.workspaceId, t.slug),
}));

export const articleTag = pgTable('article_tag', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  tagSlugUnique: uniqueIndex('tag_slug_unique').on(t.workspaceId, t.slug),
}));

export const articleTagRelation = pgTable('article_tag_relation', {
  articleId: uuid('article_id').notNull().references(() => article.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => articleTag.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.articleId, t.tagId] }),
}));

export const moderationResult = pgTable('moderation_result', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').notNull().references(() => article.id, { onDelete: 'cascade' }),
  status: moderationStatusEnum('status').notNull(),
  provider: varchar('provider', { length: 50 }).notNull().default('openai'),
  rawResultJson: jsonb('raw_result_json'),
  checkedAt: timestamp('checked_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const automationConfig = pgTable('automation_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().unique().references(() => organization.id, { onDelete: 'cascade' }),
  enabled: boolean('enabled').notNull().default(false),
  promptTemplate: text('prompt_template'),
  model: varchar('model', { length: 100 }).notNull().default('claude'),
  generateOnTranscript: boolean('generate_on_transcript').notNull().default(true),
  options: jsonb('options'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const scheduleConfig = pgTable('schedule_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().unique().references(() => organization.id, { onDelete: 'cascade' }),
  frequency: scheduleFrequencyEnum('frequency').notNull().default('daily'),
  cronExpr: text('cron_expr').notNull().default('0 8 * * *'),
  timezone: text('timezone').notNull().default('America/Sao_Paulo'),
  quotaPerRun: integer('quota_per_run').notNull().default(412),
  nextRunAt: timestamp('next_run_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const wallet = pgTable('wallet', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().unique().references(() => organization.id, { onDelete: 'cascade' }),
  balance: integer('balance').notNull().default(0),
  plan: walletPlanEnum('plan').notNull().default('free'),
  planRenewsAt: timestamp('plan_renews_at'),
  cardLast4: text('card_last4'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const creditTransaction = pgTable('credit_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  action: transactionActionEnum('action').notNull(),
  detail: text('detail'),
  amount: integer('amount').notNull(),
  category: transactionCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const payment = pgTable('payment', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  provider: paymentProviderEnum('provider').notNull(),
  kind: paymentKindEnum('kind').notNull(),
  method: paymentMethodEnum('method').notNull(),
  credits: integer('credits').notNull().default(0),
  amountCents: integer('amount_cents').notNull().default(0),
  discountCents: integer('discount_cents').notNull().default(0),
  status: paymentStatusEnum('status').notNull().default('pending'),
  externalId: text('external_id'),
  planName: text('plan_name'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/* ── Relations ── */

export const workspaceSettingsRelations = relations(workspaceSettings, ({ one }) => ({
  workspace: one(organization, { fields: [workspaceSettings.workspaceId], references: [organization.id] }),
}));

export const googleConnectionRelations = relations(googleConnection, ({ one, many }) => ({
  workspace: one(organization, { fields: [googleConnection.workspaceId], references: [organization.id] }),
  channels: many(channel),
}));

export const channelRelations = relations(channel, ({ one, many }) => ({
  workspace: one(organization, { fields: [channel.workspaceId], references: [organization.id] }),
  googleConnection: one(googleConnection, { fields: [channel.googleConnectionId], references: [googleConnection.id] }),
  videos: many(video),
}));

export const videoRelations = relations(video, ({ one }) => ({
  channel: one(channel, { fields: [video.channelId], references: [channel.id] }),
}));

export const runRelations = relations(run, ({ one }) => ({
  workspace: one(organization, { fields: [run.workspaceId], references: [organization.id] }),
}));

export const articleRelations = relations(article, ({ one, many }) => ({
  workspace: one(organization, { fields: [article.workspaceId], references: [organization.id] }),
  author: one(user, { fields: [article.authorId], references: [user.id] }),
  sourceVideo: one(video, { fields: [article.sourceVideoId], references: [video.id] }),
  tags: many(articleTagRelation),
}));

export const articleTagRelationsExport = relations(articleTag, ({ many, one }) => ({
  workspace: one(organization, { fields: [articleTag.workspaceId], references: [organization.id] }),
  articles: many(articleTagRelation),
}));

export const articleTagRelationRelations = relations(articleTagRelation, ({ one }) => ({
  article: one(article, { fields: [articleTagRelation.articleId], references: [article.id] }),
  tag: one(articleTag, { fields: [articleTagRelation.tagId], references: [articleTag.id] }),
}));

export const moderationResultRelations = relations(moderationResult, ({ one }) => ({
  article: one(article, { fields: [moderationResult.articleId], references: [article.id] }),
}));

export const automationConfigRelations = relations(automationConfig, ({ one }) => ({
  workspace: one(organization, { fields: [automationConfig.workspaceId], references: [organization.id] }),
}));

export const scheduleConfigRelations = relations(scheduleConfig, ({ one }) => ({
  workspace: one(organization, { fields: [scheduleConfig.workspaceId], references: [organization.id] }),
}));

export const walletRelations = relations(wallet, ({ one }) => ({
  workspace: one(organization, { fields: [wallet.workspaceId], references: [organization.id] }),
}));

export const creditTransactionRelations = relations(creditTransaction, ({ one }) => ({
  workspace: one(organization, { fields: [creditTransaction.workspaceId], references: [organization.id] }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  workspace: one(organization, { fields: [payment.workspaceId], references: [organization.id] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  memberships: many(member),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
}));
