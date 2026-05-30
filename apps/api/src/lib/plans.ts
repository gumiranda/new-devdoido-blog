/** Pricing constants + plan feature matrix (r2#11). */

export const PLAN_CREDITS = { free: 200, pro: 3000, scale: 12000 } as const;
export const PLAN_PRICE_CENTS = { free: 0, pro: 4900, scale: 14900 } as const;

export const PACKS = [
  { credits: 1000, priceCents: 1900 },
  { credits: 5000, priceCents: 7900 },
  { credits: 15000, priceCents: 19900 },
] as const;

export type PlanName = keyof typeof PLAN_CREDITS;
export type PaidPlan = Exclude<PlanName, "free">;

export type CheckoutAmounts = { credits: number; amountCents: number };

export interface PlanDetails {
  quotaPerRun: number;
  maxWorkspaces: number;
  /** Requests per minute for public API routes. */
  publicRateRpm: number;
  /** Max YouTube channels synced per workspace. */
  maxChannelsPerWorkspace: number;
}

export const PLANS: Record<PlanName, PlanDetails> = {
  free: {
    quotaPerRun: 5,
    maxWorkspaces: 1,
    publicRateRpm: 100,
    maxChannelsPerWorkspace: 3,
  },
  pro: {
    quotaPerRun: 100,
    maxWorkspaces: 5,
    publicRateRpm: 1000,
    maxChannelsPerWorkspace: 10,
  },
  scale: {
    quotaPerRun: 500,
    maxWorkspaces: 20,
    publicRateRpm: 10000,
    maxChannelsPerWorkspace: 50,
  },
};

/**
 * Server-side credit + price for a top-up pack, looked up by index.
 * Returns `null` for an out-of-range index — callers MUST reject it. Credits and
 * price are NEVER taken from the request body (would let a client mint credits).
 */
export function topupLine(packIndex: number): CheckoutAmounts | null {
  const pack = PACKS[packIndex];
  if (!pack) return null;
  return { credits: pack.credits, amountCents: pack.priceCents };
}

/** Server-side credit + price for a subscription plan. */
export function subscriptionLine(planName: PaidPlan): CheckoutAmounts {
  return { credits: PLAN_CREDITS[planName], amountCents: PLAN_PRICE_CENTS[planName] };
}
