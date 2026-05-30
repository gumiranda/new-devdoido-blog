import { expect, test } from "bun:test";
import { slugify } from "./lib/slug";
import { PLAN_CREDITS, PACKS } from "./lib/plans";

test("slugify normalizes accents, symbols and spaces", () => {
  expect(slugify("Próxima Execução!")).toBe("proxima-execucao");
  expect(slugify("Next.js 16 na prática")).toBe("nextjs-16-na-pratica");
});

test("pricing constants", () => {
  expect(PLAN_CREDITS.pro).toBe(3000);
  expect(PLAN_CREDITS.scale).toBe(12000);
  expect(PACKS.length).toBe(3);
});
