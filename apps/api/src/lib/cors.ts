/**
 * CORS plugin — echoes an allow-listed Origin with credentials (needed for
 * Better Auth cookies). Origins come from `env.CORS_ORIGINS` (the `CORS_ORIGIN`
 * env var, comma-separated) — the SAME list Better Auth trusts, so CORS and the
 * auth CSRF check stay in sync. Add your dev origin (e.g. http://localhost:4321)
 * there; there is no implicit localhost allowance (it would let attacker hosts
 * like `http://localhost.evil.com` through a `startsWith` check).
 */
import { Elysia } from "elysia";
import { env } from "../env";

const corsKey = (origin: string) => origin.trim().replace(/\/+$/, "");
const allowed = new Set(env.CORS_ORIGINS.map(corsKey));

export function isAllowedOrigin(origin: string | null): boolean {
  return Boolean(origin) && allowed.has(corsKey(origin as string));
}

function applyCorsHeaders(origin: string | null, headers: Record<string, string>): void {
  if (!isAllowedOrigin(origin)) return;
  headers["Access-Control-Allow-Origin"] = origin as string;
  headers["Access-Control-Allow-Credentials"] = "true";
  headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  headers["Vary"] = "Origin";
}

export const cors = new Elysia({ name: "cors" })
  .onRequest(({ request, set }) => {
    applyCorsHeaders(request.headers.get("origin"), set.headers as Record<string, string>);
  })
  .options("/*", ({ request, set }) => {
    applyCorsHeaders(request.headers.get("origin"), set.headers as Record<string, string>);
    set.status = 204;
    return null;
  });
