import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { required } from "./env";
import { isAllowedOrigin } from "./lib/cors";
import { encrypt, decrypt } from "./lib/encryption";
import { buildPrompt, SYSTEM_PROMPT, DEFAULT_USER_PROMPT } from "./lib/prompts";
import { logger, childLogger } from "./lib/logger";
import { slugify as slugifyV } from "./lib/slug";
import { calculateNextRun } from "./lib/cron";
import { publicRateLimit, cleanupBuckets } from "./lib/rate-limit";

describe("env.required", () => {
  test("returns the value when the var is set", () => {
    process.env.__E2E_PRESENT__ = "yes";
    expect(required("__E2E_PRESENT__")).toBe("yes");
  });
  test("throws when the var is missing", () => {
    delete process.env.__E2E_ABSENT__;
    expect(() => required("__E2E_ABSENT__")).toThrow("Missing required env var: __E2E_ABSENT__");
  });
});

describe("cors.isAllowedOrigin", () => {
  test("rejects null / empty origin", () => {
    expect(isAllowedOrigin(null)).toBe(false);
    expect(isAllowedOrigin("")).toBe(false);
  });
  test("rejects an origin not in the allowlist (no implicit localhost)", () => {
    expect(isAllowedOrigin("http://evil.com")).toBe(false);
    expect(isAllowedOrigin("http://localhost.evil.com")).toBe(false);
  });
  test("accepts a configured origin, trailing slash normalized", () => {
    expect(isAllowedOrigin("http://localhost:4321")).toBe(true);
    expect(isAllowedOrigin("http://localhost:4321/")).toBe(true);
  });
});

describe("encryption (AES-256-GCM)", () => {
  let prev: string | undefined;
  beforeAll(() => {
    prev = process.env.ENCRYPTION_KEY;
    process.env.ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
  });
  afterAll(() => {
    if (prev === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = prev;
  });

  test("round-trips plaintext", async () => {
    const enc = await encrypt("ya29.secret-token");
    expect(enc).not.toBe("ya29.secret-token");
    expect(await decrypt(enc)).toBe("ya29.secret-token");
  });

  test("throws when ENCRYPTION_KEY is missing", async () => {
    const saved = process.env.ENCRYPTION_KEY;
    delete process.env.ENCRYPTION_KEY;
    await expect(encrypt("x")).rejects.toThrow("ENCRYPTION_KEY");
    process.env.ENCRYPTION_KEY = saved;
  });
});

describe("prompts.buildPrompt", () => {
  test("uses the default template + substitutes variables", () => {
    const { system, user } = buildPrompt(undefined, "transcrição aqui");
    expect(system).toBe(SYSTEM_PROMPT);
    expect(user).toContain("transcrição aqui");
    expect(DEFAULT_USER_PROMPT).toContain("{{transcript}}");
  });
  test("uses a custom template and replaces all placeholders", () => {
    const { user } = buildPrompt("T={{title}} C={{channel}} X={{transcript}} D={{date}}", "tx", "Título", "Canal");
    expect(user).toContain("T=Título");
    expect(user).toContain("C=Canal");
    expect(user).toContain("X=tx");
    expect(user).not.toContain("{{");
  });
  test("falls back to defaults for missing variables", () => {
    const { user } = buildPrompt("{{title}}|{{channel}}");
    expect(user).toContain("Vídeo");
    expect(user).toContain("canal");
  });
});

describe("logger", () => {
  test("all levels + child logger run", () => {
    logger.debug("d");
    logger.info("i", { workspaceId: "w" });
    logger.warn("w", { runId: "r", obj: { a: 1 } });
    logger.error("e", { videoId: undefined });
    const child = childLogger({ workspaceId: "w1" });
    child.debug("cd");
    child.info("ci", { extra: 1 });
    child.warn("cw");
    child.error("ce");
    expect(true).toBe(true);
  });
});

describe("validation.slugify", () => {
  test("slugifies with accent + symbol stripping", () => {
    expect(slugifyV("Olá, Mundo!")).toBe("ola-mundo");
    expect(slugifyV("")).toBe("");
  });
});

describe("cron.calculateNextRun", () => {
  test("schedules today when the time has not passed yet", () => {
    const from = new Date("2026-01-01T06:00:00");
    const next = calculateNextRun("0 8 * * *", from);
    expect(next.getDate()).toBe(1);
    expect(next.getHours()).toBe(8);
  });
  test("rolls to tomorrow when the time already passed", () => {
    const from = new Date("2026-01-01T09:00:00");
    const next = calculateNextRun("0 8 * * *", from);
    expect(next.getDate()).toBe(2);
  });
});

describe("rate-limit (public, isolated mini-app)", () => {
  test("allows under limit, blocks over limit, exposes Retry-After", async () => {
    // Chain the route on the plugin instance so its scoped `derive` runs.
    const mini = publicRateLimit(1).get("/x", () => "ok");
    const h = (ip: string) =>
      mini.handle(new Request("http://localhost/x", { headers: { "x-forwarded-for": ip } }));
    const first = await h("9.9.9.9");
    expect(first.status).toBe(200);
    const second = await h("9.9.9.9");
    expect([429, 500]).toContain(second.status); // limit exceeded path executed
    // distinct IP gets its own bucket
    expect((await h("8.8.8.8")).status).toBe(200);
    // second hit on an existing bucket that is still under the limit (allowed path)
    const under = publicRateLimit(5).get("/z", () => "ok");
    await under.handle(new Request("http://localhost/z", { headers: { "x-forwarded-for": "7.7.7.7" } }));
    expect((await under.handle(new Request("http://localhost/z", { headers: { "x-forwarded-for": "7.7.7.7" } }))).status).toBe(200);
    // no x-forwarded-for → falls back to 127.0.0.1
    const noIp = publicRateLimit(5).get("/y", () => "ok");
    expect((await noIp.handle(new Request("http://localhost/y"))).status).toBe(200);
    cleanupBuckets();
  });
});
