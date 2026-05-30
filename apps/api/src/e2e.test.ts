/**
 * End-to-end suite: drives the real composed app via `app.handle()` against the
 * live Neon DB. Each run creates isolated users/orgs and tears them down in
 * afterAll. Covers every route + branch, the auth guard, CORS, and the wallet
 * credit/debit primitives.
 */
import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { and, eq, inArray } from "drizzle-orm";
import { db, debitCredit, creditWallet, InsufficientCreditsError } from "./db/client";
import * as s from "./db/schema";

let app: any;

beforeAll(async () => {
  const mod = await import("./app");
  app = mod.app;
});

// ── HTTP helper ───────────────────────────────────────────────────────────
type CallOpts = {
  method?: string;
  body?: unknown;
  cookie?: string;
  origin?: string;
  headers?: Record<string, string>;
};

async function raw(path: string, opts: CallOpts = {}): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  if (opts.cookie) headers["cookie"] = opts.cookie;
  if (opts.origin) headers["origin"] = opts.origin;
  return app.handle(
    new Request("http://localhost" + path, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    })
  );
}

async function call(path: string, opts: CallOpts = {}): Promise<{ status: number; body: any }> {
  const res = await raw(path, opts);
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body };
}

function setCookies(res: Response): string {
  const list = res.headers.getSetCookie?.() ?? [];
  return list.map((c) => c.split(";")[0]).join("; ");
}

// ── Auth fixtures ─────────────────────────────────────────────────────────
const createdOrgIds: string[] = [];
const createdUserIds: string[] = [];

async function signUp(): Promise<{ userId: string; cookie: string }> {
  const email = `e2e-${crypto.randomUUID()}@example.com`;
  const res = await raw("/api/auth/sign-up/email", {
    method: "POST",
    body: { email, password: "test12345", name: "E2E User" },
  });
  if (res.status !== 200) throw new Error(`sign-up ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const userId = body.user.id as string;
  createdUserIds.push(userId);
  return { userId, cookie: setCookies(res) };
}

async function createOrgViaApi(cookie: string): Promise<string> {
  const res = await raw("/api/auth/organization/create", {
    method: "POST",
    cookie,
    body: { name: "E2E WS", slug: `ws-${crypto.randomUUID().slice(0, 12)}` },
  });
  if (res.status !== 200) throw new Error(`org create ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const id = (body.id ?? body.organization?.id ?? body.data?.id) as string;
  createdOrgIds.push(id);
  return id;
}

async function setActive(cookie: string, organizationId: string): Promise<void> {
  await raw("/api/auth/organization/set-active", {
    method: "POST",
    cookie,
    body: { organizationId },
  });
}

/** Full active-path workspace: session has activeOrganizationId; optional wallet. */
async function makeWorkspace(opts: { wallet?: boolean; balance?: number } = {}) {
  const { userId, cookie } = await signUp();
  const orgId = await createOrgViaApi(cookie);
  await setActive(cookie, orgId);
  if (opts.wallet) {
    await db.insert(s.wallet).values({ workspaceId: orgId, balance: opts.balance ?? 0, plan: "free" });
  }
  return { userId, cookie, orgId };
}

// Shared fixtures
let MAIN: { userId: string; cookie: string; orgId: string };
let EMPTY: { userId: string; cookie: string; orgId: string }; // active, no wallet
let OTHER: { userId: string; cookie: string; orgId: string };

beforeAll(async () => {
  MAIN = await makeWorkspace({ wallet: true, balance: 100 });
  EMPTY = await makeWorkspace({ wallet: false });
  OTHER = await makeWorkspace({ wallet: true });
}, 60_000);

afterAll(async () => {
  if (createdOrgIds.length) await db.delete(s.organization).where(inArray(s.organization.id, createdOrgIds));
  if (createdUserIds.length) await db.delete(s.user).where(inArray(s.user.id, createdUserIds));
}, 60_000);

// ── Root / health / CORS ──────────────────────────────────────────────────
describe("root, health, CORS", () => {
  test("GET /api and /api/health", async () => {
    expect((await call("/api")).body).toEqual({ name: "beta-stack-api", version: "2.0.0" });
    expect((await call("/api/health")).body).toEqual({ ok: true });
  });

  test("GET with allowed Origin echoes CORS headers", async () => {
    const res = await raw("/health", { origin: "http://localhost:4321" });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:4321");
    expect(res.headers.get("access-control-allow-credentials")).toBe("true");
  });

  test("GET with disallowed Origin omits CORS headers", async () => {
    const res = await raw("/health", { origin: "http://evil.com" });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("GET without Origin omits CORS headers", async () => {
    const res = await raw("/health");
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("OPTIONS preflight returns 204 with CORS headers for allowed origin", async () => {
    const res = await raw("/articles", { method: "OPTIONS", origin: "http://localhost:4321" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-methods")).toContain("POST");
  });

  test("OPTIONS preflight for disallowed origin: 204 but no ACAO", async () => {
    const res = await raw("/articles", { method: "OPTIONS", origin: "http://evil.com" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

// ── Auth guard ────────────────────────────────────────────────────────────
describe("auth guard", () => {
  test("401 without a session", async () => {
    expect((await call("/overview")).status).toBe(401);
  });

  test("403 when authenticated but no workspace/membership", async () => {
    const { cookie } = await signUp(); // no org created
    expect((await call("/overview", { cookie })).status).toBe(403);
  });

  test("fallback resolves workspace from first membership when no active org", async () => {
    const { userId, cookie } = await signUp();
    // Create org + membership directly, WITHOUT set-active → session.activeOrganizationId stays null.
    const orgId = crypto.randomUUID();
    createdOrgIds.push(orgId);
    await db.insert(s.organization).values({ id: orgId, name: "Fallback WS", slug: `fb-${orgId.slice(0, 8)}` });
    await db.insert(s.member).values({ id: crypto.randomUUID(), organizationId: orgId, userId, role: "owner" });
    await db.insert(s.wallet).values({ workspaceId: orgId, balance: 7, plan: "free" });

    const r = await call("/overview", { cookie });
    expect(r.status).toBe(200);
    expect(r.body.balance).toBe(7);
  });
});

// ── Overview ──────────────────────────────────────────────────────────────
describe("overview", () => {
  test("empty workspace → zero counts, free plan, null schedule", async () => {
    const r = await call("/overview", { cookie: EMPTY.cookie });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ channels: 0, videos: 0, runs: 0, balance: 0, plan: "free", nextRunAt: null });
  });

  test("populated workspace reflects counts + wallet", async () => {
    const r = await call("/overview", { cookie: MAIN.cookie });
    expect(r.status).toBe(200);
    expect(r.body.balance).toBe(100);
    expect(r.body.plan).toBe("free");
  });
});

// ── Workspace ─────────────────────────────────────────────────────────────
describe("workspace", () => {
  test("GET returns org, settings null before any PUT", async () => {
    const r = await call("/workspace", { cookie: EMPTY.cookie });
    expect(r.status).toBe(200);
    expect(r.body.organization.id).toBe(EMPTY.orgId);
    expect(r.body.settings).toBeNull();
  });

  test("PUT inserts settings + renames org", async () => {
    const r = await call("/workspace", {
      method: "PUT",
      cookie: MAIN.cookie,
      body: { name: "Renamed", blogSlug: "blog", category: "tech" },
    });
    expect(r.status).toBe(200);
    expect(r.body.blogSlug).toBe("blog");
  });

  test("PUT again upserts settings without name", async () => {
    const r = await call("/workspace", { method: "PUT", cookie: MAIN.cookie, body: { category: "ai" } });
    expect(r.status).toBe(200);
    expect(r.body.category).toBe("ai");
  });
});

// ── Channels (+ google connection) ────────────────────────────────────────
describe("channels", () => {
  let connId: string;

  beforeAll(async () => {
    const [conn] = await db
      .insert(s.googleConnection)
      .values({ workspaceId: MAIN.orgId, accountEmail: "bot@example.com", status: "active" })
      .returning();
    connId = conn.id;
  }, 30_000);

  test("POST without a google connection → 400", async () => {
    const r = await call("/channels", { method: "POST", cookie: EMPTY.cookie, body: { name: "X" } });
    expect(r.status).toBe(400);
  });

  test("POST with connection: explicit handle", async () => {
    const r = await call("/channels", {
      method: "POST",
      cookie: MAIN.cookie,
      body: { name: "Rocketseat", handle: "@rocket", youtubeChannelId: "yt1" },
    });
    expect(r.status).toBe(200);
    expect(r.body.handle).toBe("@rocket");
    expect(r.body.letter).toBe("R");
  });

  test("POST with connection: derived handle (default branch)", async () => {
    const r = await call("/channels", { method: "POST", cookie: MAIN.cookie, body: { name: "Code TV" } });
    expect(r.status).toBe(200);
    expect(r.body.handle).toBe("@codetv");
  });

  test("GET lists channels", async () => {
    const r = await call("/channels", { cookie: MAIN.cookie });
    expect(r.body.length).toBeGreaterThanOrEqual(2);
  });

  test("PATCH updates; 404 for unknown id", async () => {
    const list = (await call("/channels", { cookie: MAIN.cookie })).body;
    const ok = await call(`/channels/${list[0].id}`, { method: "PATCH", cookie: MAIN.cookie, body: { active: false } });
    expect(ok.status).toBe(200);
    expect(ok.body.active).toBe(false);
    const miss = await call(`/channels/${crypto.randomUUID()}`, { method: "PATCH", cookie: MAIN.cookie, body: { active: true } });
    expect(miss.status).toBe(404);
  });

  test("DELETE removes a channel", async () => {
    const list = (await call("/channels", { cookie: MAIN.cookie })).body;
    const r = await call(`/channels/${list[list.length - 1].id}`, { method: "DELETE", cookie: MAIN.cookie });
    expect(r.body).toEqual({ ok: true });
  });

  void connId;
});

// ── Videos ────────────────────────────────────────────────────────────────
describe("videos", () => {
  let channelId: string;
  let doneVideoId: string;
  let queuedVideoId: string;

  beforeAll(async () => {
    const [conn] = await db
      .insert(s.googleConnection)
      .values({ workspaceId: MAIN.orgId, accountEmail: "vid@example.com" })
      .returning();
    const [ch] = await db
      .insert(s.channel)
      .values({ workspaceId: MAIN.orgId, googleConnectionId: conn.id, name: "VidChan" })
      .returning();
    channelId = ch.id;
    const [v1] = await db
      .insert(s.video)
      .values({ workspaceId: MAIN.orgId, channelId, title: "Done", status: "done", transcript: "hello" })
      .returning();
    const [v2] = await db
      .insert(s.video)
      .values({ workspaceId: MAIN.orgId, channelId, title: "Queued", status: "queued" })
      .returning();
    doneVideoId = v1.id;
    queuedVideoId = v2.id;
  }, 30_000);

  test("GET all + filtered by channel", async () => {
    expect((await call("/videos", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(2);
    const filtered = await call(`/videos?channel=${channelId}`, { cookie: MAIN.cookie });
    expect(filtered.body.length).toBe(2);
  });

  test("transcript: ready, not-ready (409), missing (404)", async () => {
    expect((await call(`/videos/${doneVideoId}/transcript`, { cookie: MAIN.cookie })).body.transcript).toBe("hello");
    expect((await call(`/videos/${queuedVideoId}/transcript`, { cookie: MAIN.cookie })).status).toBe(409);
    expect((await call(`/videos/${crypto.randomUUID()}/transcript`, { cookie: MAIN.cookie })).status).toBe(404);
  });
});

// ── Runs ──────────────────────────────────────────────────────────────────
describe("runs", () => {
  test("trigger creates a run; GET lists it", async () => {
    const t = await call("/runs/trigger", { method: "POST", cookie: MAIN.cookie });
    expect(t.status).toBe(200);
    expect(t.body.status).toBe("ok");
    expect((await call("/runs", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Schedule ──────────────────────────────────────────────────────────────
describe("schedule", () => {
  test("GET null before config", async () => {
    expect((await call("/schedule", { cookie: EMPTY.cookie })).body).toBeNull();
  });
  test("PUT insert with nextRunAt, then upsert without it", async () => {
    const ins = await call("/schedule", {
      method: "PUT",
      cookie: MAIN.cookie,
      body: { frequency: "weekly", timezone: "UTC", nextRunAt: new Date().toISOString() },
    });
    expect(ins.status).toBe(200);
    expect(ins.body.frequency).toBe("weekly");
    const upd = await call("/schedule", { method: "PUT", cookie: MAIN.cookie, body: { quotaPerRun: 5 } });
    expect(upd.body.quotaPerRun).toBe(5);
  });
});

// ── Automation ────────────────────────────────────────────────────────────
describe("automation", () => {
  test("GET null then PUT insert + upsert", async () => {
    expect((await call("/automation", { cookie: EMPTY.cookie })).body).toBeNull();
    const ins = await call("/automation", { method: "PUT", cookie: MAIN.cookie, body: { enabled: true } });
    expect(ins.body.enabled).toBe(true);
    const upd = await call("/automation", { method: "PUT", cookie: MAIN.cookie, body: { autoPublish: true } });
    expect(upd.body.autoPublish).toBe(true);
  });
});

// ── Articles + Tags ───────────────────────────────────────────────────────
describe("articles", () => {
  let articleId: string;

  test("POST create (slug from title) + duplicate → 409", async () => {
    const r = await call("/articles", {
      method: "POST",
      cookie: MAIN.cookie,
      body: { title: "Primeiro Artigo", contentHtml: "<p>oi</p>", category: "tech" },
    });
    expect(r.status).toBe(200);
    expect(r.body.slug).toBe("primeiro-artigo");
    articleId = r.body.id;

    const dupe = await call("/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "Primeiro Artigo" } });
    expect(dupe.status).toBe(409);
  });

  test("POST with explicit slug", async () => {
    const r = await call("/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "X", slug: "Custom Slug!" } });
    expect(r.body.slug).toBe("custom-slug");
  });

  test("POST validation error (empty title)", async () => {
    expect([400, 422]).toContain((await call("/articles", { method: "POST", cookie: MAIN.cookie, body: { title: "" } })).status);
  });

  test("GET list + filters (status, moderationStatus, q, tag)", async () => {
    expect((await call("/articles", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/articles?status=draft", { cookie: MAIN.cookie })).status).toBe(200);
    expect((await call("/articles?moderationStatus=not_checked", { cookie: MAIN.cookie })).status).toBe(200);
    expect((await call("/articles?q=Primeiro", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(1);
    expect((await call("/articles?tag=nonexistent", { cookie: MAIN.cookie })).body.length).toBe(0);
  });

  test("slug-available true/false", async () => {
    expect((await call("/articles/slug-available?slug=primeiro-artigo", { cookie: MAIN.cookie })).body.available).toBe(false);
    expect((await call("/articles/slug-available?slug=totally-free", { cookie: MAIN.cookie })).body.available).toBe(true);
  });

  test("GET :id found (with tags) + 404", async () => {
    const ok = await call(`/articles/${articleId}`, { cookie: MAIN.cookie });
    expect(ok.status).toBe(200);
    expect(Array.isArray(ok.body.tags)).toBe(true);
    expect((await call(`/articles/${crypto.randomUUID()}`, { cookie: MAIN.cookie })).status).toBe(404);
  });

  test("PATCH update + publish (approved) sets publishedAt", async () => {
    const r = await call(`/articles/${articleId}`, {
      method: "PATCH",
      cookie: MAIN.cookie,
      body: { subtitle: "sub", status: "published" },
    });
    expect(r.status).toBe(200);
    expect(r.body.status).toBe("published");
    expect(r.body.publishedAt).not.toBeNull();
  });

  test("PATCH unknown id → 404", async () => {
    expect((await call(`/articles/${crypto.randomUUID()}`, { method: "PATCH", cookie: MAIN.cookie, body: { title: "z" } })).status).toBe(404);
  });

  test("publish a blocked article → 409 moderation_failed", async () => {
    const created = await call("/articles", {
      method: "POST",
      cookie: MAIN.cookie,
      body: { title: "Bad one", contentHtml: "<p>__blocked__ content</p>" },
    });
    const r = await call(`/articles/${created.body.id}`, { method: "PATCH", cookie: MAIN.cookie, body: { status: "published" } });
    expect(r.status).toBe(409);
    expect(r.body.error).toBe("moderation_failed");
  });

  test("POST :id/moderate + 404", async () => {
    expect((await call(`/articles/${articleId}/moderate`, { method: "POST", cookie: MAIN.cookie })).body.verdict).toBe("approved");
    expect((await call(`/articles/${crypto.randomUUID()}/moderate`, { method: "POST", cookie: MAIN.cookie })).status).toBe(404);
  });

  describe("tags on an article", () => {
    test("attach by name (creates), then reuse existing", async () => {
      const created = (await call(`/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "DevOps" } })).body;
      expect(created.some((t: any) => t.slug === "devops")).toBe(true);
      const reuse = await call(`/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "DevOps" } });
      expect(reuse.status).toBe(200);
    });

    test("attach by owned tagId", async () => {
      const [tag] = await db.insert(s.articleTag).values({ workspaceId: MAIN.orgId, name: "Owned", slug: `owned-${crypto.randomUUID().slice(0, 6)}` }).returning();
      const r = await call(`/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { tagId: tag.id } });
      expect(r.status).toBe(200);
    });

    test("cross-tenant tagId → 404", async () => {
      const [foreign] = await db.insert(s.articleTag).values({ workspaceId: OTHER.orgId, name: "Foreign", slug: `foreign-${crypto.randomUUID().slice(0, 6)}` }).returning();
      const r = await call(`/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: { tagId: foreign.id } });
      expect(r.status).toBe(404);
    });

    test("neither tagId nor name → 400", async () => {
      expect((await call(`/articles/${articleId}/tags`, { method: "POST", cookie: MAIN.cookie, body: {} })).status).toBe(400);
    });

    test("attach on unknown article → 404", async () => {
      expect((await call(`/articles/${crypto.randomUUID()}/tags`, { method: "POST", cookie: MAIN.cookie, body: { name: "Z" } })).status).toBe(404);
    });

    test("list filtered by tag slug now returns the article", async () => {
      const r = await call("/articles?tag=devops", { cookie: MAIN.cookie });
      expect(r.body.length).toBeGreaterThanOrEqual(1);
    });

    test("DELETE a tag relation + 404 on unknown article", async () => {
      const tags = (await call(`/articles/${articleId}`, { cookie: MAIN.cookie })).body.tags;
      const r = await call(`/articles/${articleId}/tags/${tags[0].id}`, { method: "DELETE", cookie: MAIN.cookie });
      expect(r.status).toBe(200);
      expect((await call(`/articles/${crypto.randomUUID()}/tags/${tags[0].id}`, { method: "DELETE", cookie: MAIN.cookie })).status).toBe(404);
    });
  });

  test("DELETE the article", async () => {
    expect((await call(`/articles/${articleId}`, { method: "DELETE", cookie: MAIN.cookie })).body).toEqual({ ok: true });
  });
});

// ── Tags listing ──────────────────────────────────────────────────────────
describe("tags listing", () => {
  test("GET tags with counts", async () => {
    await db.insert(s.articleTag).values({ workspaceId: MAIN.orgId, name: "ListTag", slug: `lt-${crypto.randomUUID().slice(0, 6)}` });
    const r = await call("/tags", { cookie: MAIN.cookie });
    expect(r.status).toBe(200);
    expect(r.body.length).toBeGreaterThanOrEqual(1);
    expect(r.body[0]).toHaveProperty("count");
  });
});

// ── Wallet ────────────────────────────────────────────────────────────────
describe("wallet", () => {
  test("null wallet workspace", async () => {
    const r = await call("/wallet", { cookie: EMPTY.cookie });
    expect(r.body.wallet).toBeNull();
    expect(r.body.consumption).toEqual([]);
    expect(r.body.history).toEqual([]);
  });

  test("populated wallet with consumption + history", async () => {
    await creditWallet(MAIN.orgId, "recharge", 50, "test recharge");
    await debitCredit(MAIN.orgId, "generate_article", 10, "test article");
    const r = await call("/wallet", { cookie: MAIN.cookie });
    expect(r.body.wallet.balance).toBeGreaterThan(0);
    expect(r.body.consumption.length).toBeGreaterThanOrEqual(1);
    expect(r.body.history.length).toBeGreaterThanOrEqual(2);
  });
});

// ── Billing ───────────────────────────────────────────────────────────────
describe("billing", () => {
  test("GET payments empty initially", async () => {
    expect((await call("/billing/payments", { cookie: OTHER.cookie })).body).toEqual([]);
  });

  test("checkout subscription (card → stripe) updates plan", async () => {
    const r = await call("/billing/checkout", {
      method: "POST",
      cookie: MAIN.cookie,
      body: { kind: "subscription", method: "card", planName: "pro" },
    });
    expect(r.status).toBe(200);
    expect(r.body.payment.provider).toBe("stripe");
    expect(r.body.payment.credits).toBe(3000);
    expect(r.body.payment.status).toBe("paid");
  });

  test("checkout topup (pix → abacatepay) credits wallet", async () => {
    const r = await call("/billing/checkout", {
      method: "POST",
      cookie: MAIN.cookie,
      body: { kind: "topup", method: "pix", packIndex: 0 },
    });
    expect(r.status).toBe(200);
    expect(r.body.payment.provider).toBe("abacatepay");
    expect(r.body.payment.credits).toBe(1000);
  });

  test("checkout subscription without planName → 400", async () => {
    expect((await call("/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "subscription", method: "pix" } })).status).toBe(400);
  });

  test("checkout topup without packIndex → 400", async () => {
    expect((await call("/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "pix" } })).status).toBe(400);
  });

  test("checkout topup with out-of-range packIndex → 400", async () => {
    expect((await call("/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "pix", packIndex: 99 } })).status).toBe(400);
  });

  test("checkout validation error (bad method)", async () => {
    expect([400, 422]).toContain((await call("/billing/checkout", { method: "POST", cookie: MAIN.cookie, body: { kind: "topup", method: "bitcoin", packIndex: 0 } })).status);
  });

  test("GET payments lists the completed ones", async () => {
    expect((await call("/billing/payments", { cookie: MAIN.cookie })).body.length).toBeGreaterThanOrEqual(2);
  });
});

// ── Wallet primitives (db/client.ts) ──────────────────────────────────────
describe("wallet credit/debit primitives", () => {
  test("debit guards amount > 0 (synchronous throw)", () => {
    expect(() => debitCredit(MAIN.orgId, "index_check", 0)).toThrow("debit amount must be > 0");
  });
  test("credit guards amount > 0 (synchronous throw)", () => {
    expect(() => creditWallet(MAIN.orgId, "recharge", -5)).toThrow("credit amount must be > 0");
  });
  test("debit beyond balance throws InsufficientCreditsError", async () => {
    await expect(debitCredit(MAIN.orgId, "index_check", 10_000_000)).rejects.toBeInstanceOf(InsufficientCreditsError);
  });
  test("operating on a wallet-less workspace throws not-found", async () => {
    await expect(debitCredit(EMPTY.orgId, "index_check", 1)).rejects.toThrow(/wallet not found/);
  });
  test("debit then credit succeed and adjust balance", async () => {
    const before = (await db.select().from(s.wallet).where(eq(s.wallet.workspaceId, MAIN.orgId)).limit(1))[0].balance;
    const afterDebit = await debitCredit(MAIN.orgId, "transcribe_minute", 3, "unit debit");
    expect(afterDebit).toBe(before - 3);
    const afterCredit = await creditWallet(MAIN.orgId, "monthly_subscription", 3, "unit credit");
    expect(afterCredit).toBe(before);
  });
});

// keep referenced to satisfy noUnusedLocals if enabled
void and;
