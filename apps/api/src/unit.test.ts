import { expect, test, describe } from "bun:test";
import { required } from "./env";
import { isAllowedOrigin } from "./lib/cors";

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
    // .env CORS_ORIGIN includes http://localhost:4321
    expect(isAllowedOrigin("http://localhost:4321")).toBe(true);
    expect(isAllowedOrigin("http://localhost:4321/")).toBe(true);
  });
});
