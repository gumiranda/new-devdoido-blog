/**
 * End-to-end suite: drives the real composed app via `app.handle()` against the
 * live Neon DB. Isolated users/orgs per run, torn down in afterAll. Covers every
 * route + branch across all modules, the auth guard, CORS, rate-limit, the wallet
 * primitives, and the external integrations (Google / Gladia / Stripe / Abacate /
 * GSC / S3) via `env` toggling + `fetch` mocking.
 */
import { expect, test, describe, beforeAll, afterAll, setDefaultTimeout } from "bun:test";
import { and, eq, inArray } from "drizzle-orm";

// e2e hits the real Neon DB over the network — generous default so it passes
// without remembering `--timeout` (heavy multi-call tests can exceed 5s).
setDefaultTimeout(30_000);
import { app } from "./app";
import { db, debitCredit, creditWallet, InsufficientCreditsError } from "./db/client";
import { env } from "./env";
import { encrypt } from "./lib/encryption";
import { enhanceArticleSeo } from "./modules/seo";
import { checkAndRun, startCronScheduler } from "./lib/cron";
import { authenticatedRateLimit } from "./lib/rate-limit";
import { Elysia } from "elysia";
import { PLANS } from "./lib/plans";
import * as s from "./db/schema";

// ── HTTP helper (random IP per call to dodge the IP rate-limiter) ───────────
let ipCounter = 0;
type CallOpts = { method?: string; body?: unknown; cookie?: string; origin?: string; headers?: Record<string, string> };

async function raw(path: string, opts: CallOpts = {}): Promise<Response> {
  const headers: Record<string, string> = { "x-forwarded-for": `10.0.${(ipCounter >> 8) & 255}.${ipCounter++ & 255}`, ...(opts.headers ?? {}) };
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  if (opts.cookie) headers["cookie"] = opts.cookie;
  if (opts.origin) headers["origin"] = opts.origin;
  return app.handle(new Request("http://localhost" + path, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  }));
}

async function call(path: string, opts: CallOpts = {}): Promise<{ status: number; body: any; res: Response }> {
  const res = await raw(path, opts);
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, body, res };
}

function setCookies(res: Response): string {
  return (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
}

// ── env + fetch test utilities ─────────────────────────────────────────────
async function withEnv(patch: Record<string, any>, fn: () => Promise<void>) {
  const saved: Record<string, any> = {};
  for (const k of Object.keys(patch)) { saved[k] = (env as any)[k]; (env as any)[k] = patch[k]; }
  try { await fn(); } finally { for (const k of Object.keys(patch)) (env as any)[k] = saved[k]; }
}

type Route = { match: (u: string) => boolean; resp: (u: string, init?: any) => Response | Promise<Response> };
async function withFetch(routes: Route[], fn: () => Promise<void>) {
  const orig = globalThis.fetch;
  (globalThis as any).fetch = async (input: any, init: any) => {
    const url = typeof input === "string" ? input : input?.url ?? String(input);
    for (const r of routes) if (r.match(url)) return r.resp(url, init);
    return orig(input, init);
  };
  try { await fn(); } finally { (globalThis as any).fetch = orig; }
}
const jsonResp = (obj: any, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

// ── Auth fixtures ──────────────────────────────────────────────────────────
const createdOrgIds: string[] = [];
const createdUserIds: string[] = [];

async function signUp(): Promise<{ userId: string; cookie: string }> {
  const email = `e2e-${crypto.randomUUID()}@example.com`;
  const res = await raw("/api/auth/sign-up/email", { method: "POST", body: { email, password: "test12345", name: "E2E User" } });
  if (res.status !== 200) throw new Error(`sign-up ${res.status}: ${await res.text()}`);
  const body = await res.json();
  createdUserIds.push(body.user.id);
  return { userId: body.user.id, cookie: setCookies(res) };
}

async function createOrgViaApi(cookie: string): Promise<string> {
  const res = await raw("/api/auth/organization/create", { method: "POST", cookie, body: { name: "E2E WS", slug: `ws-${crypto.randomUUID().slice(0, 12)}` } });
  if (res.status !== 200) throw new Error(`org create ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const id = (body.id ?? body.organization?.id ?? body.data?.id) as string;
  createdOrgIds.push(id);
  return id;
}

async function setActive(cookie: string, organizationId: string): Promise<void> {
  await raw("/api/auth/organization/set-active", { method: "POST", cookie, body: { organizationId } });
}

async function makeWorkspace(opts: { balance?: number } = {}) {
  const { userId, cookie } = await signUp();
  const orgId = await createOrgViaApi(cookie); // afterCreateOrganization bootstraps wallet/settings/automation/schedule
  await setActive(cookie, orgId);
  if (opts.balance !== undefined) await db.update(s.wallet).set({ balance: opts.balance }).where(eq(s.wallet.workspaceId, orgId));
  return { userId, cookie, orgId };
}

/** A workspace with NO bootstrapped rows (org created directly, bypassing the hook). */
async function makeBareWorkspace() {
  const { userId, cookie } = await signUp();
  const orgId = crypto.randomUUID();
  createdOrgIds.push(orgId);
  await db.insert(s.organization).values({ id: orgId, name: "Bare", slug: `bare-${orgId.slice(0, 8)}` });
  await db.insert(s.member).values({ id: crypto.randomUUID(), organizationId: orgId, userId, role: "owner" });
  await setActive(cookie, orgId);
  return { userId, cookie, orgId };
}

// ── direct DB seed helpers ─────────────────────────────────────────────────
async function seedGoogleConn(orgId: string, fields: Partial<typeof s.googleConnection.$inferInsert> = {}) {
  // google_connection is 1:1 per workspace (unique) — reuse if one already exists.
  const [existing] = await db.select().from(s.googleConnection).where(eq(s.googleConnection.workspaceId, orgId)).limit(1);
  if (existing) return existing;
  const [c] = await db.insert(s.googleConnection).values({ workspaceId: orgId, accountEmail: "bot@example.com", ...fields }).returning();
  return c;
}
async function seedChannel(orgId: string, connId: string, fields: Partial<typeof s.channel.$inferInsert> = {}) {
  const [c] = await db.insert(s.channel).values({ workspaceId: orgId, googleConnectionId: connId, name: "Chan", ...fields }).returning();
  return c;
}
async function seedVideo(orgId: string, channelId: string, fields: Partial<typeof s.video.$inferInsert> = {}) {
  const [v] = await db.insert(s.video).values({ workspaceId: orgId, channelId, title: "Vid", ...fields }).returning();
  return v;
}
async function seedArticle(orgId: string, fields: Partial<typeof s.article.$inferInsert> = {}) {
  const [a] = await db.insert(s.article).values({ workspaceId: orgId, title: "Art", slug: `a-${crypto.randomUUID().slice(0, 8)}`, ...fields }).returning();
  return a;
}

let MAIN: { userId: string; cookie: string; orgId: string };
let BARE: { userId: string; cookie: string; orgId: string };
let OTHER: { userId: string; cookie: string; orgId: string };

beforeAll(async () => {
  MAIN = await makeWorkspace({ balance: 100 });
  BARE = await makeBareWorkspace();
  OTHER = await makeWorkspace({ balance: 50 });
}, 60_000);

afterAll(async () => {
  if (createdOrgIds.length) await db.delete(s.organization).where(inArray(s.organization.id, createdOrgIds));
  if (createdUserIds.length) await db.delete(s.user).where(inArray(s.user.id, createdUserIds));
}, 60_000);

// ── Root / health / CORS / SEO files ───────────────────────────────────────
describe("root, health, CORS, sitemap", () => {
  test("GET /api and /api/health", async () => {
    expect((await call("/api")).body.name).toBe("beta-stack-api");
    expect((await call("/api/health")).body).toEqual({ ok: true });
  });
  test("sitemap.xml + sitemap-articles.xml + robots.txt", async () => {
    expect((await call("/sitemap.xml")).body).toContain("<sitemapindex");
    expect((await call("/sitemap-articles.xml")).body).toContain("<urlset");
    const robots = await call("/robots.txt");
    expect(robots.body).toContain("User-agent");
    expect(robots.body).toContain("Sitemap:");
  });
  test("CORS allowed origin echoes headers; disallowed/absent does not", async () => {
    expect((await raw("/api/health", { origin: "http://localhost:4321" })).headers.get("access-control-allow-origin")).toBe("http://localhost:4321");
    expect((await raw("/api/health", { origin: "http://evil.com" })).headers.get("access-control-allow-origin")).toBeNull();
    expect((await raw("/api/health")).headers.get("access-control-allow-origin")).toBeNull();
  });
  test("OPTIONS preflight 204 for allowed; no ACAO for disallowed", async () => {
    const ok = await raw("/api/v1/articles", { method: "OPTIONS", origin: "http://localhost:4321" });
    expect(ok.status).toBe(204);
    expect(ok.headers.get("access-control-allow-methods")).toContain("POST");
    const bad = await raw("/api/v1/articles", { method: "OPTIONS", origin: "http://evil.com" });
    expect(bad.status).toBe(204);
    expect(bad.headers.get("access-control-allow-origin")).toBeNull();
  });
});

// ── Auth guard ─────────────────────────────────────────────────────────────
describe("auth guard", () => {
  test("401 without a session", async () => {
    expect((await call("/api/v1/overview")).status).toBe(401);
  });
  test("403 when authenticated but no membership", async () => {
    const { cookie } = await signUp();
    expect((await call("/api/v1/overview", { cookie })).status).toBe(403);
  });
  test("fallback resolves workspace from first membership (no active org)", async () => {
    const { userId, cookie } = await signUp();
    const orgId = crypto.randomUUID();
    createdOrgIds.push(orgId);
    await db.insert(s.organization).values({ id: orgId, name: "Fallback", slug: `fb-${orgId.slice(0, 8)}` });
    await db.insert(s.member).values({ id: crypto.randomUUID(), organizationId: orgId, userId, role: "owner" });
    await db.insert(s.wallet).values({ workspaceId: orgId, balance: 7, plan: "free" });
    const r = await call("/api/v1/overview", { cookie });
    expect(r.status).toBe(200);
    expect(r.body.balance).toBe(7);
  });
});

// ── Overview / Workspace ───────────────────────────────────────────────────
describe("overview + workspace", () => {
  test("overview empty vs populated", async () => {
    expect((await call("/api/v1/overview", { cookie: BARE.cookie })).body).toMatchObject({ channels: 0, videos: 0, balance: 0, plan: "free", nextRunAt: null });
    expect((await call("/api/v1/overview", { cookie: MAIN.cookie })).body.balance).toBe(100);
  });
  test("workspace GET null settings, PUT insert + upsert", async () => {
    expect((await call("/api/v1/workspace", { cookie: BARE.cookie })).body.settings).toBeNull();
    expect((await call("/api/v1/workspace", { method: "PUT", cookie: MAIN.cookie, body: { name: "Renamed", blogSlug: "blog", category: "tech" } })).body.blogSlug).toBe("blog");
    expect((await call("/api/v1/workspace", { method: "PUT", cookie: MAIN.cookie, body: { category: "ai" } })).body.category).toBe("ai");
  });
});

// ── Channels ───────────────────────────────────────────────────────────────
describe("channels", () => {
  beforeAll(async () => { await seedGoogleConn(MAIN.orgId, { accountEmail: "ch@example.com" }); }, 30_000);
  test("POST without google connection → 400", async () => {
    expect((await call("/api/v1/channels", { method: "POST", cookie: BARE.cookie, body: { name: "X" } })).status).toBe(400);
  });
  test("POST explicit + derived handle; letter from name", async () => {
    expect((await call("/api/v1/channels", { method: "POST", cookie: MAIN.cookie, body: { name: "Rocketseat", handle: "@rocket" } })).body.handle).toBe("@rocket");
    expect((await call("/api/v1/channels", { method: "POST", cookie: MAIN.cookie, body: { name: "Code TV" } })).body.handle).toBe("@codetv");
  });
  test("GET list, PATCH ok + 404, DELETE", async () => {
    const list = (await call("/api/v1/channels", { cookie: MAIN.cookie })).body;
    expect(list.length).toBeGreaterThanOrEqual(2);
    expect((await call(`/api/v1/channels/${list[0].id}`, { method: "PATCH", cookie: MAIN.cookie, body: { active: false } })).body.active).toBe(false);
    expect((await call(`/api/v1/channels/${crypto.randomUUID()}`, { method: "PATCH", cookie: MAIN.cookie, body: { active: true } })).status).toBe(404);
    expect((await call(`/api/v1/channels/${list[list.length - 1].id}`, { method: "DELETE", cookie: MAIN.cookie })).body).toEqual({ ok: true });
  });
});

// ── Videos (+ transcribe / retry) ──────────────────────────────────────────
describe("videos", () => {
  let channelId: string, doneId: string, queuedId: string, erroredId: string, ytId: string;
  beforeAll(async () => {
    const conn = await seedGoogleConn(MAIN.orgId, { accountEmail: "v@example.com" });
    const ch = await seedChannel(MAIN.orgId, conn.id, { name: "VidChan" });
    channelId = ch.id;
    doneId = (await seedVideo(MAIN.orgId, channelId, { title: "Done", status: "done", transcript: "hi" })).id;
    queuedId = (await seedVideo(MAIN.orgId, channelId, { title: "Queued", status: "queued" })).id;
    erroredId = (await seedVideo(MAIN.orgId, channelId, { title: "Err", transcriptStatus: "error" })).id;
    ytId = (await seedVideo(MAIN.orgId, channelId, { title: "Yt", youtubeVideoId: "abc123" })).id;
  }, 30_000);

  test("GET all + filter by channel + transcriptStatus", async () => {
    expect((await call("/api/v1/videos", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(4);
    expect((await call(`/api/v1/videos?channel=${channelId}`, { cookie: MAIN.cookie })).body.length).toBe(4);
    expect((await call(`/api/v1/videos?transcriptStatus=error`, { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
  });
  test("transcript ready / not-ready / missing", async () => {
    expect((await call(`/api/v1/videos/${doneId}/transcript`, { cookie: MAIN.cookie })).body.transcript).toBe("hi");
    expect((await call(`/api/v1/videos/${queuedId}/transcript`, { cookie: MAIN.cookie })).status).toBe(409);
    expect((await call(`/api/v1/videos/${crypto.randomUUID()}/transcript`, { cookie: MAIN.cookie })).status).toBe(404);
  });
  test("retry-transcript: 404, 409 (not errored), ok (errored)", async () => {
    expect((await call(`/api/v1/videos/${crypto.randomUUID()}/retry-transcript`, { method: "POST", cookie: MAIN.cookie })).status).toBe(404);
    expect((await call(`/api/v1/videos/${doneId}/retry-transcript`, { method: "POST", cookie: MAIN.cookie })).status).toBe(409);
    expect((await call(`/api/v1/videos/${erroredId}/retry-transcript`, { method: "POST", cookie: MAIN.cookie })).body).toEqual({ ok: true });
  });
  test("transcribe: 503 unconfigured", async () => {
    expect((await call(`/api/v1/videos/${ytId}/transcribe`, { method: "POST", cookie: MAIN.cookie })).status).toBe(503);
  });
  test("transcribe: 404 / 400-no-ytid / success / 502 / 500", async () => {
    await withEnv({ GLADIA_API_KEY: "k" }, async () => {
      expect((await call(`/api/v1/videos/${crypto.randomUUID()}/transcribe`, { method: "POST", cookie: MAIN.cookie })).status).toBe(404);
      expect((await call(`/api/v1/videos/${queuedId}/transcribe`, { method: "POST", cookie: MAIN.cookie })).status).toBe(400);
      await withFetch([{ match: (u) => u.includes("gladia.io"), resp: () => jsonResp({ id: "job1" }) }], async () => {
        expect((await call(`/api/v1/videos/${ytId}/transcribe`, { method: "POST", cookie: MAIN.cookie })).body.status).toBe("processing");
      });
      await withFetch([{ match: (u) => u.includes("gladia.io"), resp: () => new Response("nope", { status: 500 }) }], async () => {
        expect((await call(`/api/v1/videos/${ytId}/transcribe`, { method: "POST", cookie: MAIN.cookie })).status).toBe(502);
      });
      await withFetch([{ match: (u) => u.includes("gladia.io"), resp: () => { throw new Error("network"); } }], async () => {
        expect((await call(`/api/v1/videos/${ytId}/transcribe`, { method: "POST", cookie: MAIN.cookie })).status).toBe(500);
      });
    });
  });
});

// ── Runs / Schedule / Automation ───────────────────────────────────────────
describe("runs, schedule, automation", () => {
  test("runs trigger + list", async () => {
    expect((await call("/api/v1/runs/trigger", { method: "POST", cookie: MAIN.cookie })).body.runId).toBeDefined();
    expect((await call("/api/v1/runs", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
  });
  test("schedule null → insert (nextRunAt) → upsert", async () => {
    expect((await call("/api/v1/schedule", { cookie: BARE.cookie })).body).toBeNull();
    expect((await call("/api/v1/schedule", { method: "PUT", cookie: MAIN.cookie, body: { frequency: "weekly", timezone: "UTC", nextRunAt: new Date(Date.now() + 9e8).toISOString() } })).body.frequency).toBe("weekly");
    expect((await call("/api/v1/schedule", { method: "PUT", cookie: MAIN.cookie, body: { quotaPerRun: 5 } })).body.quotaPerRun).toBe(5);
  });
  test("automation null → insert → upsert", async () => {
    expect((await call("/api/v1/automation", { cookie: BARE.cookie })).body).toBeNull();
    expect((await call("/api/v1/automation", { method: "PUT", cookie: MAIN.cookie, body: { enabled: true } })).body.enabled).toBe(true);
    expect((await call("/api/v1/automation", { method: "PUT", cookie: MAIN.cookie, body: { autoPublish: true } })).body.autoPublish).toBe(true);
  });
});

// ── Articles + Tags ────────────────────────────────────────────────────────
describe("articles + tags", () => {
  let articleId: string;
  test("POST create (+dup 409) + explicit slug + validation", async () => {
    const r = await call("/api/v1/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "Primeiro Artigo", contentHtml: "<p>oi</p>", metaTitle: "Meta" } });
    expect(r.body.slug).toBe("primeiro-artigo");
    articleId = r.body.id;
    expect((await call("/api/v1/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "Primeiro Artigo" } })).status).toBe(409);
    expect((await call("/api/v1/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "X", slug: "Custom Slug!" } })).body.slug).toBe("custom-slug");
    expect([400, 422]).toContain((await call("/api/v1/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "" } })).status);
  });
  test("GET list + filters", async () => {
    expect((await call("/api/v1/articles", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/articles?status=draft", { cookie: MAIN.cookie })).status).toBe(200);
    expect((await call("/api/v1/articles?moderationStatus=not_checked", { cookie: MAIN.cookie })).status).toBe(200);
    expect((await call("/api/v1/articles?q=Primeiro", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/articles?tag=none", { cookie: MAIN.cookie })).body.length).toBe(0);
  });
  test("slug-available + GET :id (+404)", async () => {
    expect((await call("/api/v1/articles/slug-available?slug=primeiro-artigo", { cookie: MAIN.cookie })).body.available).toBe(false);
    expect((await call("/api/v1/articles/slug-available?slug=free-one", { cookie: MAIN.cookie })).body.available).toBe(true);
    expect(Array.isArray((await call(`/api/v1/articles/${articleId}`, { cookie: MAIN.cookie })).body.tags)).toBe(true);
    expect((await call(`/api/v1/articles/${crypto.randomUUID()}`, { cookie: MAIN.cookie })).status).toBe(404);
  });
  test("PATCH publish (approved) + 404 + blocked 409", async () => {
    const ok = await call(`/api/v1/articles/${articleId}`, { method: "PATCH", cookie: MAIN.cookie, body: { subtitle: "s", status: "published" } });
    expect(ok.body.status).toBe("published");
    expect((await call(`/api/v1/articles/${crypto.randomUUID()}`, { method: "PATCH", cookie: MAIN.cookie, body: { title: "z" } })).status).toBe(404);
    const bad = await call("/api/v1/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "Bad", contentHtml: "<p>__blocked__</p>" } });
    expect((await call(`/api/v1/articles/${bad.body.id}`, { method: "PATCH", cookie: MAIN.cookie, body: { status: "published" } })).body.error).toBe("moderation_failed");
  });
  test("moderate (+404)", async () => {
    expect((await call(`/api/v1/articles/${articleId}/moderate`, { method: "POST", cookie: MAIN.cookie })).body.verdict).toBe("approved");
    expect((await call(`/api/v1/articles/${crypto.randomUUID()}/moderate`, { method: "POST", cookie: MAIN.cookie })).status).toBe(404);
  });
  test("tags: by name (create+reuse), owned tagId, cross-tenant 404, none 400, unknown article 404, list, delete", async () => {
    expect((await call(`/api/v1/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "DevOps" } })).body.some((t: any) => t.slug === "devops")).toBe(true);
    expect((await call(`/api/v1/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "DevOps" } })).status).toBe(200);
    const [owned] = await db.insert(s.articleTag).values({ workspaceId: MAIN.orgId, name: "Owned", slug: `o-${crypto.randomUUID().slice(0, 6)}` }).returning();
    expect((await call(`/api/v1/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { tagId: owned.id } })).status).toBe(200);
    const [foreign] = await db.insert(s.articleTag).values({ workspaceId: OTHER.orgId, name: "F", slug: `f-${crypto.randomUUID().slice(0, 6)}` }).returning();
    expect((await call(`/api/v1/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { tagId: foreign.id } })).status).toBe(404);
    expect((await call(`/api/v1/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: {} })).status).toBe(400);
    expect((await call(`/api/v1/articles/${crypto.randomUUID()}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "Z" } })).status).toBe(404);
    expect((await call("/api/v1/articles?tag=devops", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
    const tags = (await call(`/api/v1/articles/${articleId}`, { cookie: MAIN.cookie })).body.tags;
    expect((await call(`/api/v1/articles/${articleId}/tags/${tags[0].id}`, { method: "DELETE", cookie: MAIN.cookie })).status).toBe(200);
    expect((await call(`/api/v1/articles/${crypto.randomUUID()}/tags/${tags[0].id}`, { method: "DELETE", cookie: MAIN.cookie })).status).toBe(404);
  });
  test("DELETE article + tags listing with count", async () => {
    expect((await call(`/api/v1/articles/${articleId}`, { method: "DELETE", cookie: MAIN.cookie })).body).toEqual({ ok: true });
    const t = await call("/api/v1/tags", { cookie: MAIN.cookie });
    expect(t.body[0]).toHaveProperty("count");
  });
});

// ── Wallet + Billing + primitives ──────────────────────────────────────────
describe("wallet + billing", () => {
  test("wallet null vs populated (consumption + history)", async () => {
    expect((await call("/api/v1/wallet", { cookie: BARE.cookie })).body.wallet).toBeNull();
    await creditWallet(MAIN.orgId, "recharge", 50, "rc");
    await debitCredit(MAIN.orgId, "generate_article", 10, "art");
    const r = await call("/api/v1/wallet", { cookie: MAIN.cookie });
    expect(r.body.consumption.length).toBeGreaterThanOrEqual(1);
    expect(r.body.history.length).toBeGreaterThanOrEqual(2);
  });
  test("checkout subscription (card→stripe) + topup (pix→abacatepay) + 400s + validation", async () => {
    const sub = await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "subscription", method: "card", planName: "pro" } });
    expect(sub.body.payment.provider).toBe("stripe");
    expect(sub.body.payment.credits).toBe(3000);
    expect((await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "pix", packIndex: 0 } })).body.payment.provider).toBe("abacatepay");
    expect((await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "subscription", method: "pix" } })).status).toBe(400);
    expect((await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "pix" } })).status).toBe(400);
    expect((await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "pix", packIndex: 99 } })).status).toBe(400);
    expect([400, 422]).toContain((await call("/api/v1/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "bitcoin", packIndex: 0 } })).status);
    expect((await call("/api/v1/billing/payments", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(2);
  });
  test("credit/debit primitives", async () => {
    expect(() => debitCredit(MAIN.orgId, "index_check", 0)).toThrow("debit amount must be > 0");
    expect(() => creditWallet(MAIN.orgId, "recharge", -5)).toThrow("credit amount must be > 0");
    await expect(debitCredit(MAIN.orgId, "index_check", 10_000_000)).rejects.toBeInstanceOf(InsufficientCreditsError);
    await expect(debitCredit(BARE.orgId, "index_check", 1)).rejects.toThrow(/wallet not found/);
    const before = (await db.select().from(s.wallet).where(eq(s.wallet.workspaceId, MAIN.orgId)).limit(1))[0].balance;
    expect(await debitCredit(MAIN.orgId, "transcribe_minute", 3)).toBe(before - 3);
    expect(await creditWallet(MAIN.orgId, "monthly_subscription", 3)).toBe(before);
  });
});

// ── Public module (no auth) ────────────────────────────────────────────────
describe("public", () => {
  let wsSlug: string;
  beforeAll(async () => {
    const [org] = await db.select({ slug: s.organization.slug }).from(s.organization).where(eq(s.organization.id, OTHER.orgId)).limit(1);
    wsSlug = org.slug!;
    await db.insert(s.workspaceSettings).values({ workspaceId: OTHER.orgId, blogSlug: wsSlug, category: "tech" }).onConflictDoNothing();
    const [tag] = await db.insert(s.articleTag).values({ workspaceId: OTHER.orgId, name: "Pub", slug: "pub" }).returning();
    const art = await seedArticle(OTHER.orgId, { title: "Público", slug: "publico", status: "published", moderationStatus: "approved", category: "tech", excerpt: "ex", publishedAt: new Date() });
    await db.insert(s.articleTagRelation).values({ articleId: art.id, tagId: tag.id });
    await seedArticle(OTHER.orgId, { title: "Flagged", slug: "flagged", status: "published", moderationStatus: "flagged", publishedAt: new Date() });
  }, 30_000);

  test("articles: default + workspace + unknown workspace + category + q + tag + pagination", async () => {
    expect((await call("/api/v1/public/articles")).body.length).toBeGreaterThanOrEqual(1);
    expect((await call(`/api/v1/public/articles?workspace=${wsSlug}`)).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/public/articles?workspace=__nope__")).body).toEqual([]);
    expect((await call("/api/v1/public/articles?category=tech")).status).toBe(200);
    expect((await call("/api/v1/public/articles?q=Públ")).status).toBe(200);
    expect((await call("/api/v1/public/articles?tag=pub")).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/public/articles?page=1&perPage=5")).status).toBe(200);
  });
  test("single article by workspace+slug: ok, workspace 404, article 404", async () => {
    expect((await call(`/api/v1/public/articles/${wsSlug}/publico`)).body.slug).toBe("publico");
    expect((await call(`/api/v1/public/articles/__nope__/publico`)).status).toBe(404);
    expect((await call(`/api/v1/public/articles/${wsSlug}/missing`)).status).toBe(404);
  });
  test("feed + saas + categories (+ workspace filter + unknown)", async () => {
    expect((await call("/api/v1/public/feed?page=1")).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/public/saas")).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/api/v1/public/categories")).body).toContain("tech");
    expect((await call(`/api/v1/public/categories?workspace=${wsSlug}`)).status).toBe(200);
    expect((await call("/api/v1/public/categories?workspace=__nope__")).body).toEqual([]);
  });
});

// ── Upload ─────────────────────────────────────────────────────────────────
describe("upload", () => {
  test("503 unconfigured / presigned when configured", async () => {
    expect((await call("/api/v1/upload/presigned?filename=a.png", { cookie: MAIN.cookie })).status).toBe(503);
    await withEnv({ S3_ENDPOINT: "https://r2.example.com", S3_BUCKET: "b", S3_ACCESS_KEY_ID: "k", S3_SECRET_ACCESS_KEY: "sec" }, async () => {
      const r = await call("/api/v1/upload/presigned?filename=a.png", { cookie: MAIN.cookie });
      expect(r.body.uploadUrl).toContain("r2.example.com");
    });
  });
});

// ── Webhooks ───────────────────────────────────────────────────────────────
describe("webhooks", () => {
  test("gladia: missing id 400, done, error, other", async () => {
    expect((await call("/api/v1/webhook/gladia", { method: "POST", body: {} })).status).toBe(400);
    const conn = await seedGoogleConn(OTHER.orgId, { accountEmail: "gl@example.com" });
    const ch = await seedChannel(OTHER.orgId, conn.id, { name: "Gl" });
    await seedVideo(OTHER.orgId, ch.id, { transcriptStatus: "processing" });
    expect((await call("/api/v1/webhook/gladia", { method: "POST", body: { id: "j", status: "done", result: { transcription: { full_transcript: "hello world", utterances: [{ words: [{ word: "hello" }, { word: "world" }] }] } } } })).body.status).toBe("done");
    await seedVideo(OTHER.orgId, ch.id, { transcriptStatus: "processing" });
    expect((await call("/api/v1/webhook/gladia", { method: "POST", body: { id: "j", status: "error", error: { message: "boom" } } })).body.status).toBe("error");
    await seedVideo(OTHER.orgId, ch.id, { transcriptStatus: "processing" });
    expect((await call("/api/v1/webhook/gladia", { method: "POST", body: { id: "j", status: "processing" } })).body.status).toBe("processing");
  }, 30_000);

  test("abacatepay: 401 no signature, success credits + plan", async () => {
    expect((await call("/api/v1/webhook/abacatepay", { method: "POST", body: {} })).status).toBe(401);
    await withEnv({ ABACATEPAY_WEBHOOK_SECRET: "sec" }, async () => {
      const [pay] = await db.insert(s.payment).values({ workspaceId: MAIN.orgId, provider: "abacatepay", kind: "topup", method: "pix", credits: 500, amountCents: 1900, externalId: "ext-aba", planName: "pro", status: "pending" }).returning();
      expect((await call("/api/v1/webhook/abacatepay", { method: "POST", headers: { "x-abacatepay-signature": "sig" }, body: { event: "payment.succeeded", data: { external_id: "ext-aba", amount: 1900, status: "paid" } } })).body).toEqual({ ok: true });
      expect((await db.select().from(s.payment).where(eq(s.payment.id, pay.id)).limit(1))[0].status).toBe("paid");
    });
  });

  test("stripe: 401 no signature, success", async () => {
    expect((await call("/api/v1/webhook/stripe", { method: "POST", body: {} })).status).toBe(401);
    await withEnv({ STRIPE_WEBHOOK_SECRET: "whsec" }, async () => {
      const [pay] = await db.insert(s.payment).values({ workspaceId: MAIN.orgId, provider: "stripe", kind: "subscription", method: "card", credits: 500, amountCents: 1900, externalId: "ext-stripe", planName: "pro", status: "pending" }).returning();
      expect((await call("/api/v1/webhook/stripe", { method: "POST", headers: { "stripe-signature": "t=1,v1=x" }, body: { type: "checkout.session.completed", data: { object: { metadata: { paymentId: "ext-stripe" }, status: "complete" } } } })).body).toEqual({ ok: true });
      expect((await db.select().from(s.payment).where(eq(s.payment.id, pay.id)).limit(1))[0].status).toBe("paid");
    });
  });
});

// ── GSC ────────────────────────────────────────────────────────────────────
describe("gsc", () => {
  test("check: 404, 400, 402, stub-checking, cached, real result; batch-check", async () => {
    expect((await call(`/api/v1/gsc/check/${crypto.randomUUID()}`, { method: "POST", cookie: MAIN.cookie })).status).toBe(404);
    const draft = await seedArticle(MAIN.orgId, { status: "draft" });
    expect((await call(`/api/v1/gsc/check/${draft.id}`, { method: "POST", cookie: MAIN.cookie })).status).toBe(400);
    const poorArt = await seedArticle(BARE.orgId, { status: "published", publishedAt: new Date() });
    expect((await call(`/api/v1/gsc/check/${poorArt.id}`, { method: "POST", cookie: BARE.cookie })).status).toBe(402);
    await creditWallet(MAIN.orgId, "recharge", 20, "gsc credits");
    const art = await seedArticle(MAIN.orgId, { status: "published", publishedAt: new Date() });
    expect((await call(`/api/v1/gsc/check/${art.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("checking");
    expect((await call(`/api/v1/gsc/check/${art.id}`, { method: "POST", cookie: MAIN.cookie })).body.cached).toBe(true);
    const art2 = await seedArticle(MAIN.orgId, { status: "published", publishedAt: new Date() });
    await withEnv({ GOOGLE_SEARCH_CONSOLE_PROPERTY: "sc-domain:devdoido.com.br" }, async () => {
      await withFetch([{ match: (u) => u.includes("searchconsole.googleapis.com"), resp: () => jsonResp({ inspectionResult: { indexStatusResult: { coverageState: "Submitted and indexed", crawledAs: "MOBILE", lastCrawlTime: "2026-01-01" } } }) }], async () => {
        expect((await call(`/api/v1/gsc/check/${art2.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("indexed");
      });
    });
    expect((await call("/api/v1/gsc/batch-check", { method: "POST", cookie: BARE.cookie })).status).toBe(200);
    // fresh published article (indexCheckedAt null) so batch-check's result branch runs
    await seedArticle(MAIN.orgId, { status: "published", publishedAt: new Date() });
    await withEnv({ GOOGLE_SEARCH_CONSOLE_PROPERTY: "sc-domain:devdoido.com.br" }, async () => {
      await withFetch([{ match: (u) => u.includes("searchconsole.googleapis.com"), resp: () => jsonResp({ inspectionResult: { indexStatusResult: { coverageState: "URL is not indexed" } } }) }], async () => {
        expect((await call("/api/v1/gsc/batch-check", { method: "POST", cookie: MAIN.cookie })).status).toBe(200);
      });
    });
  }, 30_000);
});

// ── Google OAuth + sync ────────────────────────────────────────────────────
describe("google", () => {
  let G: { userId: string; cookie: string; orgId: string };
  beforeAll(async () => {
    process.env.ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
    G = await makeWorkspace();
  }, 30_000);

  test("connection null then present", async () => {
    expect((await call("/api/v1/google/connection", { cookie: G.cookie })).body).toBeNull();
    await seedGoogleConn(G.orgId, { accountEmail: "g@example.com" });
    expect((await call("/api/v1/google/connection", { cookie: G.cookie })).body.accountEmail).toBe("g@example.com");
  });

  test("authorize: unconfigured vs redirect", async () => {
    expect((await call("/api/v1/google/authorize", { cookie: G.cookie })).body.error).toContain("not configured");
    await withEnv({ GOOGLE_CLIENT_ID: "cid", GOOGLE_REDIRECT_URI: "http://localhost/cb" }, async () => {
      const r = await raw("/api/v1/google/authorize", { cookie: G.cookie });
      expect([301, 302]).toContain(r.status);
      expect(r.headers.get("location")).toContain("accounts.google.com");
    });
  });

  test("callback: 400 no code, 400 bad state, token !ok 400, success redirect", async () => {
    // /callback sits behind authGuard → pass a session cookie; workspaceId comes from `state`.
    expect((await call("/api/v1/google/callback", { cookie: G.cookie })).status).toBe(400);
    expect((await call("/api/v1/google/callback?code=c", { cookie: G.cookie })).status).toBe(400);
    const state = Buffer.from(JSON.stringify({ workspaceId: G.orgId })).toString("base64url");
    await withEnv({ GOOGLE_CLIENT_ID: "cid", GOOGLE_CLIENT_SECRET: "sec", GOOGLE_REDIRECT_URI: "http://localhost/cb" }, async () => {
      await withFetch([{ match: (u) => u.includes("oauth2.googleapis.com/token"), resp: () => new Response("no", { status: 400 }) }], async () => {
        expect((await call(`/api/v1/google/callback?code=c&state=${state}`, { cookie: G.cookie })).status).toBe(400);
      });
      await withFetch([
        { match: (u) => u.includes("oauth2.googleapis.com/token"), resp: () => jsonResp({ access_token: "at", refresh_token: "rt", expires_in: 3600 }) },
        { match: (u) => u.includes("oauth2/v2/userinfo"), resp: () => jsonResp({ email: "person@example.com" }) },
      ], async () => {
        expect([301, 302]).toContain((await raw(`/api/v1/google/callback?code=c&state=${state}`, { cookie: G.cookie })).status);
      });
    });
  });

  test("sync: no conn 400, token-null 400, no-channels, import success, search-error 0", async () => {
    const N = await makeWorkspace();
    expect((await call("/api/v1/google/sync", { method: "POST", cookie: N.cookie })).status).toBe(400);
    await seedGoogleConn(N.orgId, { accountEmail: "n@example.com" });
    expect((await call("/api/v1/google/sync", { method: "POST", cookie: N.cookie })).status).toBe(400);
    const validToken = await encrypt("ya29.live");
    await db.update(s.googleConnection).set({ accessToken: validToken, tokenExpiresAt: new Date(Date.now() + 3.6e6) }).where(eq(s.googleConnection.workspaceId, N.orgId));
    expect((await call("/api/v1/google/sync", { method: "POST", cookie: N.cookie })).body).toEqual({ synced: 0, imported: 0 });
    const [conn] = await db.select().from(s.googleConnection).where(eq(s.googleConnection.workspaceId, N.orgId)).limit(1);
    await seedChannel(N.orgId, conn.id, { name: "Sync", youtubeChannelId: "UC1", active: true });
    await withFetch([{ match: (u) => u.includes("/youtube/v3/search"), resp: () => jsonResp({ items: [{ id: { videoId: "vid1" }, snippet: { title: "T", publishedAt: "2026-01-01T00:00:00Z", thumbnails: {} }, contentDetails: { duration: "PT1M30S" } }] }) }], async () => {
      expect((await call("/api/v1/google/sync", { method: "POST", cookie: N.cookie })).body.imported).toBeGreaterThanOrEqual(1);
    });
    await withFetch([{ match: (u) => u.includes("/youtube/v3/search"), resp: () => new Response("err", { status: 403 }) }], async () => {
      expect((await call("/api/v1/google/sync", { method: "POST", cookie: N.cookie })).body.imported).toBe(0);
    });
  }, 30_000);

  test("sync: refresh-token path", async () => {
    const R = await makeWorkspace();
    const refresh = await encrypt("refresh-tok");
    await seedGoogleConn(R.orgId, { accountEmail: "r@example.com", refreshToken: refresh, tokenExpiresAt: new Date(Date.now() - 1000) });
    await withEnv({ GOOGLE_CLIENT_ID: "cid", GOOGLE_CLIENT_SECRET: "sec" }, async () => {
      await withFetch([{ match: (u) => u.includes("oauth2.googleapis.com/token"), resp: () => jsonResp({ access_token: "fresh", expires_in: 3600 }) }], async () => {
        expect((await call("/api/v1/google/sync", { method: "POST", cookie: R.cookie })).body).toEqual({ synced: 0, imported: 0 });
      });
    });
  }, 30_000);

  test("disconnect", async () => {
    expect((await call("/api/v1/google/disconnect", { method: "POST", cookie: G.cookie })).body).toEqual({ ok: true });
  });
});

// ── SEO module + enhanceArticleSeo ─────────────────────────────────────────
describe("seo", () => {
  test("GET /seo info", async () => {
    expect((await call("/api/v1/seo")).body.service).toBe("seo-aeo");
  });
  test("enhanceArticleSeo: null for missing; populates with faq + answerBox + truncation", async () => {
    expect(await enhanceArticleSeo(crypto.randomUUID())).toBeNull();
    const art = await seedArticle(MAIN.orgId, {
      title: "T".repeat(80),
      excerpt: "E".repeat(200),
      answerBox: "resumo",
      faqJson: { questions: [{ question: "q?", answer: "a" }] } as any,
      category: "tech",
      publishedAt: new Date(),
    });
    const out = await enhanceArticleSeo(art.id);
    expect(out?.metaTitle.endsWith("…")).toBe(true);
    expect(out?.metaDescription.endsWith("…")).toBe(true);
    expect(out?.faqJson).toBeDefined();
    expect(out?.answerBox).toBe("resumo");
  });
  test("enhanceArticleSeo: faqJson as a plain array, no answerBox", async () => {
    const art = await seedArticle(MAIN.orgId, { title: "Curto", faqJson: [{ question: "q?", answer: "a" }] as any });
    const out = await enhanceArticleSeo(art.id);
    expect(out?.faqJson).toBeDefined();
    expect(out?.answerBox).toBeUndefined();
  });
});

// ── Cron worker ────────────────────────────────────────────────────────────
describe("cron", () => {
  test("checkAndRun triggers due schedules (ok + error log); startCronScheduler runs", async () => {
    const C = await makeWorkspace();
    // bootstrap already created a scheduleConfig — make it due.
    await db.update(s.scheduleConfig).set({ nextRunAt: new Date(Date.now() - 60_000), cronExpr: "0 8 * * *" }).where(eq(s.scheduleConfig.workspaceId, C.orgId));
    await withFetch([{ match: (u) => u.includes("/runs/trigger"), resp: () => new Response("ok", { status: 200 }) }], async () => {
      await checkAndRun();
    });
    expect((await db.select().from(s.cronLog).where(eq(s.cronLog.workspaceId, C.orgId))).length).toBeGreaterThanOrEqual(1);
    await db.update(s.scheduleConfig).set({ nextRunAt: new Date(Date.now() - 60_000) }).where(eq(s.scheduleConfig.workspaceId, C.orgId));
    await withFetch([{ match: (u) => u.includes("/runs/trigger"), resp: () => { throw new Error("down"); } }], async () => {
      await checkAndRun();
    });
    expect((await db.select().from(s.cronLog).where(eq(s.cronLog.workspaceId, C.orgId))).some((l) => l.status === "error")).toBe(true);
    startCronScheduler();
    await new Promise((r) => setTimeout(r, 300));
  }, 30_000);
});

// ── GSC edge mappings + inspect failures ───────────────────────────────────
describe("gsc edges", () => {
  test("coverageState mapping (excluded/unknown), inspect !ok, inspect throws", async () => {
    await creditWallet(MAIN.orgId, "recharge", 50, "gsc edges");
    const mk = () => seedArticle(MAIN.orgId, { status: "published", publishedAt: new Date() });
    await withEnv({ GOOGLE_SEARCH_CONSOLE_PROPERTY: "sc-domain:x" }, async () => {
      const a1 = await mk();
      await withFetch([{ match: (u) => u.includes("searchconsole"), resp: () => jsonResp({ inspectionResult: { indexStatusResult: { coverageState: "Excluded by noindex tag" } } }) }], async () => {
        expect((await call(`/api/v1/gsc/check/${a1.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("excluded");
      });
      const a2 = await mk();
      await withFetch([{ match: (u) => u.includes("searchconsole"), resp: () => jsonResp({ inspectionResult: { indexStatusResult: { coverageState: "Totally novel state" } } }) }], async () => {
        expect((await call(`/api/v1/gsc/check/${a2.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("unknown");
      });
      const a3 = await mk();
      await withFetch([{ match: (u) => u.includes("searchconsole"), resp: () => new Response("err", { status: 500 }) }], async () => {
        expect((await call(`/api/v1/gsc/check/${a3.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("checking");
      });
      const a4 = await mk();
      await withFetch([{ match: (u) => u.includes("searchconsole"), resp: () => { throw new Error("net"); } }], async () => {
        expect((await call(`/api/v1/gsc/check/${a4.id}`, { method: "POST", cookie: MAIN.cookie })).body.indexState).toBe("checking");
      });
    });
  }, 30_000);
});

// ── Google refresh-token failure path ──────────────────────────────────────
describe("google refresh edge", () => {
  test("undecryptable refresh token → access token null → sync 400", async () => {
    process.env.ENCRYPTION_KEY = Buffer.alloc(32, 5).toString("base64");
    const X = await makeWorkspace();
    await seedGoogleConn(X.orgId, { accountEmail: "x@example.com", refreshToken: "not-a-valid-ciphertext", tokenExpiresAt: new Date(Date.now() - 1000) });
    expect((await call("/api/v1/google/sync", { method: "POST", cookie: X.cookie })).status).toBe(400);
  }, 30_000);
});

// ── Runs pipeline (transcribe → generate → moderate) ───────────────────────
describe("runs pipeline", () => {
  let P: { cookie: string; orgId: string };
  let chId: string;
  const clearVideos = () => db.delete(s.video).where(eq(s.video.workspaceId, P.orgId));
  const ready = (title: string, transcript: string | null = "transcrição longa do vídeo aqui") =>
    seedVideo(P.orgId, chId, { title, status: "done", transcriptStatus: "done", transcript });
  const pending = (title: string, yt: string) =>
    seedVideo(P.orgId, chId, { title, status: "queued", transcriptStatus: "pending", youtubeVideoId: yt });
  const setConfig = (patch: Partial<typeof s.automationConfig.$inferInsert>) =>
    db.update(s.automationConfig).set(patch).where(eq(s.automationConfig.workspaceId, P.orgId));
  const trigger = () => call("/api/v1/runs/trigger", { method: "POST", cookie: P.cookie });

  beforeAll(async () => {
    const w = await makeWorkspace({ balance: 5000 });
    P = { cookie: w.cookie, orgId: w.orgId };
    const conn = await seedGoogleConn(P.orgId, { accountEmail: "p@example.com" });
    chId = (await seedChannel(P.orgId, conn.id, { name: "P" })).id;
    await setConfig({ enabled: true, generateOnTranscript: true, autoPublish: false });
  }, 30_000);

  test("trigger basic (no videos)", async () => {
    expect((await trigger()).body.runId).toBeDefined();
  });

  test("transcribe pending: Gladia ok + throw → error", async () => {
    await pending("p1", "yt1");
    await withEnv({ GLADIA_API_KEY: "k" }, async () => {
      await withFetch([{ match: (u) => u.includes("gladia.io"), resp: () => jsonResp({ id: "g1" }) }], async () => {
        expect((await trigger()).body.transcribed).toBeGreaterThanOrEqual(1);
      });
      await pending("p2", "yt2");
      await withFetch([{ match: (u) => u.includes("gladia.io"), resp: () => { throw new Error("down"); } }], async () => {
        await trigger();
      });
      const [errVid] = await db.select().from(s.video).where(and(eq(s.video.workspaceId, P.orgId), eq(s.video.transcriptStatus, "error"))).limit(1);
      expect(errVid).toBeDefined();
    });
    await clearVideos();
  }, 30_000);

  test("generate (stub, no ANTHROPIC) → draft article", async () => {
    await ready("Stub Generation");
    expect((await trigger()).body.generated).toBeGreaterThanOrEqual(1);
    await clearVideos();
  }, 30_000);

  test("generate insufficient credits → caught, generated 0", async () => {
    await db.update(s.wallet).set({ balance: 0 }).where(eq(s.wallet.workspaceId, P.orgId));
    await ready("No Credits");
    expect((await trigger()).body.generated).toBe(0);
    await db.update(s.wallet).set({ balance: 5000 }).where(eq(s.wallet.workspaceId, P.orgId));
    await clearVideos();
  }, 30_000);

  test("generate via Anthropic: valid JSON, parse-fail fallback, !ok, title-less slug", async () => {
    await withEnv({ ANTHROPIC_API_KEY: "ak" }, async () => {
      await ready("Claude JSON");
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => jsonResp({ content: [{ text: JSON.stringify({ title: "Claude Gen", contentHtml: "<p>x</p>", excerpt: "e", metaDescription: "m", answerBox: "a", faq: [{ question: "q", answer: "a" }], tags: ["t"] }) }] }) }], async () => {
        expect((await trigger()).body.generated).toBeGreaterThanOrEqual(1);
      });
      await clearVideos();
      await ready("Claude Bad JSON");
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => jsonResp({ content: [{ text: "not json at all" }] }) }], async () => {
        expect((await trigger()).body.generated).toBeGreaterThanOrEqual(1);
      });
      await clearVideos();
      await ready("Claude Err");
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => new Response("err", { status: 500 }) }], async () => {
        expect((await trigger()).body.generated).toBe(0);
      });
      await clearVideos();
      await ready("Title Less");
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => jsonResp({ content: [{ text: JSON.stringify({ contentHtml: "<p>no title</p>" }) }] }) }], async () => {
        expect((await trigger()).body.generated).toBeGreaterThanOrEqual(1);
      });
      await clearVideos();
    });
  }, 60_000);

  test("auto-publish + OpenAI moderation: approved, flagged, throws", async () => {
    await setConfig({ autoPublish: true });
    await withEnv({ OPENAI_API_KEY: "ok" }, async () => {
      await ready("Pub Approved");
      await withFetch([{ match: (u) => u.includes("openai.com"), resp: () => jsonResp({ results: [{ flagged: false }] }) }], async () => {
        expect((await trigger()).body.generated).toBeGreaterThanOrEqual(1);
      });
      await clearVideos();
      await ready("Pub Flagged");
      await withFetch([{ match: (u) => u.includes("openai.com"), resp: () => jsonResp({ results: [{ flagged: true }] }) }], async () => {
        await trigger();
      });
      await clearVideos();
      await ready("Pub Throws");
      await withFetch([{ match: (u) => u.includes("openai.com"), resp: () => { throw new Error("mod down"); } }], async () => {
        await trigger();
      });
      await clearVideos();
    });
    await setConfig({ autoPublish: false });
  }, 60_000);

  test("generation skipped: disabled, generateOnTranscript=false, no transcript", async () => {
    await setConfig({ enabled: false });
    await ready("Disabled");
    expect((await trigger()).body.generated).toBe(0);
    await clearVideos();
    await setConfig({ enabled: true, generateOnTranscript: false });
    await ready("NoGenOnTranscript");
    expect((await trigger()).body.generated).toBe(0);
    await clearVideos();
    await setConfig({ generateOnTranscript: true });
    await ready("NoTranscript", null);
    expect((await trigger()).body.generated).toBe(0);
    await clearVideos();
  }, 30_000);

  test("preview: 404, 409, prompt-only, Anthropic JSON, parse-fail, 502", async () => {
    expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: crypto.randomUUID() } })).status).toBe(404);
    const noTx = await seedVideo(P.orgId, chId, { title: "NoTx", status: "queued" });
    expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: noTx.id } })).status).toBe(409);
    const vid = await ready("Preview Vid");
    expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: vid.id } })).body.note).toContain("not configured");
    await withEnv({ ANTHROPIC_API_KEY: "ak" }, async () => {
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => jsonResp({ content: [{ text: JSON.stringify({ contentHtml: "<p>ok</p>" }) }] }) }], async () => {
        expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: vid.id, promptOverride: "X {{transcript}}" } })).body.preview).toBeDefined();
      });
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => jsonResp({ content: [{ text: "plain text" }] }) }], async () => {
        expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: vid.id } })).body.preview.contentHtml).toBe("plain text");
      });
      await withFetch([{ match: (u) => u.includes("anthropic.com"), resp: () => new Response("e", { status: 500 }) }], async () => {
        expect((await call("/api/v1/runs/preview", { method: "POST", cookie: P.cookie, body: { videoId: vid.id } })).status).toBe(502);
      });
    });
    await clearVideos();
  }, 30_000);
});

// ── Authenticated rate-limit (covers wsId branch + 429) ────────────────────
describe("authenticated rate-limit", () => {
  test("limits per-workspace when workspaceId is present on the request", async () => {
    // Chain the route on the plugin instance itself so its scoped `resolve` runs.
    const mini = authenticatedRateLimit().get("/x", () => "ok");
    const hit = () => {
      const req = new Request("http://localhost/x");
      Reflect.set(req, "workspaceId", BARE.orgId);
      return mini.handle(req);
    };
    const savedRpm = PLANS.free.publicRateRpm;
    PLANS.free.publicRateRpm = 1;
    try {
      expect((await hit()).status).toBe(200);
      expect([429, 500]).toContain((await hit()).status);
    } finally {
      PLANS.free.publicRateRpm = savedRpm;
    }
    const mini2 = authenticatedRateLimit().get("/y", () => "ok");
    expect((await mini2.handle(new Request("http://localhost/y"))).status).toBe(200);
  });
});
