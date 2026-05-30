/** Pricing constants (ported from `apps/landing/src/lib/mock.ts` PLANS/PACKS). */
export const PLAN_CREDITS = { free: 200, pro: 3000, scale: 12000 } as const;
export const PLAN_PRICE_CENTS = { free: 0, pro: 4900, scale: 14900 } as const;

export const PACKS = [
  { credits: 1000, priceCents: 1900 },
  { credits: 5000, priceCents: 7900 },
  { credits: 15000, priceCents: 19900 },
] as const;

export type PlanName = keyof typeof PLAN_CREDITS;
