/**
 * Centralized API layer — wraps Eden Treaty calls for the landing admin.
 * Replaces `src/lib/mock.ts` progressively.
 *
 * Every function expects a session cookie (credentials: include) — auth errors
 * bubble up as ApiError.
 */
import { api } from "./eden";
import type { authClient } from "./auth-client";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handle<T>(promise: Promise<{ data: T | null; error: unknown; status: number }>): Promise<T> {
  const resp = await promise;
  if (resp.error || resp.status >= 400) {
    const msg = typeof resp.error === "object" && resp.error !== null
      ? (resp.error as Record<string, unknown>).message ?? JSON.stringify(resp.error)
      : String(resp.error ?? `HTTP ${resp.status}`);
    throw new ApiError(resp.status, String(msg), resp.error);
  }
  return resp.data as T;
}

/* ─── Overview ─── */

export async function fetchOverview() {
  return handle(api.overview.get());
}

/* ─── Channels ─── */

export async function fetchChannels() {
  const data = await handle(api.channels.get());
  return data ?? [];
}

export async function createChannel(body: { name: string; handle?: string; youtubeChannelId?: string }) {
  return handle(api.channels.post(body));
}

export async function updateChannel(id: string, body: { name?: string; active?: boolean; subscribers?: number; lastVideoLabel?: string }) {
  return handle(api.channels[id].patch(body));
}

export async function deleteChannel(id: string) {
  return handle(api.channels[id].delete());
}

/* ─── Videos / Library ─── */

export async function fetchVideos(channelId?: string, transcriptStatus?: string) {
  const query: Record<string, string> = {};
  if (channelId) query.channel = channelId;
  if (transcriptStatus) query.transcriptStatus = transcriptStatus;
  const data = await handle(api.videos.get({ query }));
  return data ?? [];
}

export async function fetchVideoTranscript(id: string) {
  return handle(api.videos[id].transcript.get());
}

export async function retryVideoTranscript(id: string) {
  return handle(api.videos[id]["retry-transcript"].post());
}

/* ─── Articles ─── */

export async function fetchArticles(params?: {
  status?: string;
  tag?: string;
  moderationStatus?: string;
  q?: string;
}) {
  const query: Record<string, string> = {};
  if (params?.status) query.status = params.status;
  if (params?.tag) query.tag = params.tag;
  if (params?.moderationStatus) query.moderationStatus = params.moderationStatus;
  if (params?.q) query.q = params.q;
  const data = await handle(api.articles.get({ query }));
  return data ?? [];
}

export async function fetchArticle(id: string) {
  return handle(api.articles[id].get());
}

export async function createArticle(body: {
  title: string;
  subtitle?: string;
  slug?: string;
  contentHtml?: string;
  excerpt?: string;
  coverUrl?: string;
  category?: string;
  source?: "ia" | "manual";
  sourceVideoId?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  schemaJson?: unknown;
  faqJson?: unknown;
  answerBox?: string;
}) {
  return handle(api.articles.post(body));
}

export async function updateArticle(id: string, body: {
  title?: string;
  subtitle?: string;
  contentHtml?: string;
  excerpt?: string;
  coverUrl?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  schemaJson?: unknown;
  faqJson?: unknown;
  answerBox?: string;
}) {
  return handle(api.articles[id].patch(body));
}

export async function deleteArticle(id: string) {
  return handle(api.articles[id].delete());
}

export async function moderateArticle(id: string) {
  return handle(api.articles[id].moderate.post());
}

export async function articleSlugAvailable(slug: string) {
  return handle(api.articles["slug-available"].get({ query: { slug } }));
}

/* ─── Tags ─── */

export async function fetchTags() {
  const data = await handle(api.tags.get());
  return data ?? [];
}

export async function addArticleTag(articleId: string, body: { tagId?: string; name?: string }) {
  return handle(api.articles[articleId].tags.post(body));
}

export async function removeArticleTag(articleId: string, tagId: string) {
  return handle(api.articles[articleId].tags[tagId].delete());
}

/* ─── Automation ─── */

export async function fetchAutomation() {
  return handle(api.automation.get());
}

export async function updateAutomation(body: {
  enabled?: boolean;
  promptTemplate?: string;
  model?: string;
  generateOnTranscript?: boolean;
  autoPublish?: boolean;
  options?: unknown;
}) {
  return handle(api.automation.put(body));
}

/* ─── Schedule ─── */

export async function fetchSchedule() {
  return handle(api.schedule.get());
}

export async function updateSchedule(body: {
  frequency?: "daily" | "weekly" | "monthly";
  cronExpr?: string;
  timezone?: string;
  quotaPerRun?: number;
}) {
  return handle(api.schedule.put(body));
}

/* ─── Runs ─── */

export async function fetchRuns() {
  const data = await handle(api.runs.get());
  return data ?? [];
}

/* ─── Workspace / MySaaS ─── */

export async function fetchWorkspace() {
  return handle(api.workspace.get());
}

export async function updateWorkspace(body: {
  name?: string;
  blogSlug?: string;
  category?: string;
  color?: string;
  description?: string;
  website?: string;
  instagram?: string;
  coverUrl?: string;
  logoUrl?: string;
}) {
  return handle(api.workspace.put(body));
}

/* ─── Wallet / Billing ─── */

export async function fetchWallet() {
  return handle(api.wallet.get());
}

export async function fetchPayments() {
  const data = await handle(api.billing.payments.get());
  return data ?? [];
}

export async function checkout(body: {
  kind: "topup" | "subscription";
  method: "pix" | "card";
  packIndex?: number;
  planName?: "pro" | "scale";
}) {
  return handle(api.billing.checkout.post(body));
}
