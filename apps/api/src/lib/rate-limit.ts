/**
 * Tiered rate-limiting plugin for Elysia.
 *
 * Public routes: IP-based, default 100/min.
 * Authenticated routes: per workspace plan (from wallet.plan → PLANS lookup).
 * Returns 429 + Retry-After header when exceeded.
 */

import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { wallet } from "../db/schema";
import { PLANS, type PlanName } from "./plans";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? "127.0.0.1";
}

function checkRateLimit(key: string, limit: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count++;
  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

/** Public rate limit: IP-based, 100/min by default. */
export function publicRateLimit(limit = 100) {
  return new Elysia().derive(({ request, set }) => {
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(`public:${ip}`, limit);
    if (!allowed) {
      set.status = 429;
      set.headers["retry-after"] = String(retryAfter);
      throw new Error("Too Many Requests");
    }
  });
}

/** Authenticated rate limit: per workspace plan tier. */
export function authenticatedRateLimit() {
  return new Elysia().resolve(async ({ request, set }) => {
    // Workspace ID is set by authGuard — if not present, skip (public route).
    const wsId = Reflect.get(request, "workspaceId") as string | undefined;

    if (wsId) {
      const [w] = await db.select({ plan: wallet.plan }).from(wallet).where(eq(wallet.workspaceId, wsId)).limit(1);
      const plan: PlanName = (w?.plan as PlanName) ?? "free";
      const limit = PLANS[plan]?.publicRateRpm ?? 100;
      const { allowed, retryAfter } = checkRateLimit(`auth:${wsId}`, limit);
      if (!allowed) {
        set.status = 429;
        set.headers["retry-after"] = String(retryAfter);
        throw new Error("Too Many Requests");
      }
    }

    // For unauthenticated requests hitting guarded routes, the guard returns 401 first anyway.
  });
}

/** Periodic cleanup to prevent memory leak (called externally or by cron). */
export function cleanupBuckets() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

// Cleanup every 5 minutes
setInterval(cleanupBuckets, 5 * 60_000);
