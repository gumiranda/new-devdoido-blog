import { expect, test } from "bun:test";
import { slugify } from "./lib/slug";
import { PLAN_CREDITS, PACKS, topupLine, subscriptionLine } from "./lib/plans";

test("slugify normalizes accents, symbols and spaces", () => {
  expect(slugify("Próxima Execução!")).toBe("proxima-execucao");
  expect(slugify("Next.js 16 na prática")).toBe("nextjs-16-na-pratica");
});

test("pricing constants", () => {
  expect(PLAN_CREDITS.pro).toBe(3000);
  expect(PLAN_CREDITS.scale).toBe(12000);
  expect(PACKS.length).toBe(3);
});

test("checkout lines are derived server-side, not from the client", () => {
  // Top-up amounts come from PACKS by index — a client can only pick WHICH pack.
  expect(topupLine(0)).toEqual({ credits: 1000, amountCents: 1900 });
  expect(topupLine(2)).toEqual({ credits: 15000, amountCents: 19900 });
  // Out-of-range / negative pack index is rejected (no forged credits).
  expect(topupLine(99)).toBeNull();
  expect(topupLine(-1)).toBeNull();
  // Subscriptions price from the plan, never the body.
  expect(subscriptionLine("pro")).toEqual({ credits: 3000, amountCents: 4900 });
  expect(subscriptionLine("scale")).toEqual({ credits: 12000, amountCents: 14900 });
});
