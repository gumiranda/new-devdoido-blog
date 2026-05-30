/**
 * CORS plugin — echoes allowed Origin with credentials (needed for Better Auth
 * cookies). Ported from the original demo's CORS logic; localhost always allowed.
 */
import { Elysia } from "elysia";
import { env } from "../env";

const corsKey = (origin: string) => origin.trim().replace(/\/+$/, "");
const allowed = new Set(env.CORS_ORIGINS.map(corsKey));

function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) return true;
  return allowed.has(corsKey(origin));
}

function applyCorsHeaders(origin: string | null, headers: Record<string, string>): void {
  if (!origin || !isOriginAllowed(origin)) return;
  headers["Access-Control-Allow-Origin"] = origin;
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
