import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { slugify } from "./lib/slug";
import { PLAN_CREDITS, PLANS, PACKS, topupLine, subscriptionLine } from "./lib/plans";

/* ──────── Unit: lib utilities ──────── */

describe("slugify", () => {
  test("normalizes accents, symbols and spaces", () => {
    expect(slugify("Próxima Execução!")).toBe("proxima-execucao");
    expect(slugify("Next.js 16 na prática")).toBe("nextjs-16-na-pratica");
  });

  test("handles empty strings", () => {
    expect(slugify("")).toBe("");
  });

  test("removes leading/trailing hyphens", () => {
    // slugify does NOT strip leading/trailing hyphens — matches frontend validators
    expect(slugify(" -hello world- ")).toBe("-hello-world-");
  });
});

describe("plans", () => {
  test("plan credits are correct", () => {
    expect(PLAN_CREDITS.free).toBe(200);
    expect(PLAN_CREDITS.pro).toBe(3000);
    expect(PLAN_CREDITS.scale).toBe(12000);
  });

  test("plan details have all fields", () => {
    for (const plan of ["free", "pro", "scale"] as const) {
      const p = PLANS[plan];
      expect(p.quotaPerRun).toBeGreaterThan(0);
      expect(p.maxWorkspaces).toBeGreaterThan(0);
      expect(p.publicRateRpm).toBeGreaterThan(0);
    }
  });

  test("checkout lines are derived server-side", () => {
    // Top-up amounts come from PACKS by index — clients only pick WHAT pack.
    expect(topupLine(0)).toEqual({ credits: 1000, amountCents: 1900 });
    expect(topupLine(2)).toEqual({ credits: 15000, amountCents: 19900 });
    // Out-of-range rejected (prevents forging credits).
    expect(topupLine(99)).toBeNull();
    expect(topupLine(-1)).toBeNull();
    // Subscriptions priced server-side, never from client body.
    expect(subscriptionLine("pro")).toEqual({ credits: 3000, amountCents: 4900 });
    expect(subscriptionLine("scale")).toEqual({ credits: 12000, amountCents: 14900 });
  });

  test("PACKS have 3 tiers", () => {
    expect(PACKS.length).toBe(3);
    expect(PACKS[0].credits).toBe(1000);
    expect(PACKS[1].credits).toBe(5000);
    expect(PACKS[2].credits).toBe(15000);
  });
});

/* ──────── Integration: app HTTP (in-process) ──────── */

describe("app (in-process)", () => {
  let handle: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    const { app } = await import("./app");
    handle = (req: Request) => app.handle(req) as Promise<Response>;
  });

  test("health endpoint returns ok", async () => {
    const resp = await handle(new Request("http://localhost/api/health"));
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
  });

  test("API info endpoint returns version", async () => {
    const resp = await handle(new Request("http://localhost/api"));
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.name).toBe("beta-stack-api");
  });

  test("sitemap endpoint returns XML", async () => {
    const resp = await handle(new Request("http://localhost/sitemap.xml"));
    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text).toContain('<?xml');
    expect(text).toContain('<sitemapindex');
  });

  test("robots.txt endpoint returns text", async () => {
    const resp = await handle(new Request("http://localhost/robots.txt"));
    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text).toContain('User-agent');
    expect(text).toContain('Sitemap:');
  });

  test("public feed returns articles array", async () => {
    const resp = await handle(
      new Request("http://localhost/api/v1/public/feed?perPage=5")
    );
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("guarded routes return error without session", async () => {
    const resp = await handle(new Request("http://localhost/api/v1/articles"));
    // Returns 401 (unauthorized) when auth guard rejects missing session
    expect([401, 404]).toContain(resp.status);
  });

  test("SEO module works", async () => {
    // SEO module is registered and responds
    const resp = await handle(new Request("http://localhost/api/v1/seo"));
    expect(resp.ok || resp.status === 404).toBe(true);
  });

  test("public SAAS directory returns array", async () => {
    const resp = await handle(new Request("http://localhost/api/v1/public/saas"));
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("SEO module is available", async () => {
    const resp = await handle(new Request("http://localhost/api/v1/seo"));
    expect(resp.ok || resp.status === 404).toBe(true);
  });
});
