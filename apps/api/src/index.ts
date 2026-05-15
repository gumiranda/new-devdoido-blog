import { Elysia, t } from "elysia";

/** Match browser Origin formatting (often no trailing slash). */
function corsKey(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

/** Comma-separated list (e.g. `https://app.example.com,https://preview.vercel.app`). */
const allowedCorsNormalized = new Set(
  (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((s) => corsKey(s))
    .filter(Boolean)
);

/** Return true when this Origin header may receive CORS response headers. */
function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  if (
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1")
  ) {
    return true;
  }
  return allowedCorsNormalized.has(corsKey(origin));
}

/** Echo Origin on allowed requests (needed for browsers + preflight). */
function applyCorsHeaders(origin: string | null, headers: Record<string, string>): void {
  if (!origin || !isOriginAllowed(origin)) return;
  headers["Access-Control-Allow-Origin"] = origin;
  headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";
}

// Shared types: same shape on server and client via Eden Treaty
const loginBody = t.Object({
  username: t.String({ minLength: 1 }),
  password: t.String({ minLength: 1 }),
});

const userSchema = t.Object({
  id: t.String(),
  username: t.String(),
  displayName: t.String(),
  loggedAt: t.String(), // ISO date
});

const port = Number.parseInt(process.env.PORT ?? "", 10) || 3000;
const hostname = process.env.HOST ?? "0.0.0.0";

export const app = new Elysia()
  .use((app) =>
    app.onRequest(({ request, set }) => {
      applyCorsHeaders(request.headers.get("origin"), set.headers as Record<string, string>);
    })
  )
  .options("/*", ({ request, set }) => {
    applyCorsHeaders(request.headers.get("origin"), set.headers as Record<string, string>);
    set.status = 204;
    return new Response(null, { status: 204 });
  })
  .get("/", () => ({ name: "beta-stack-api", version: "1.0.0" }))
  .get("/health", () => ({ ok: true as const }))
  .post(
    "/auth/login",
    ({ body }) => {
      // Demo: accept any username/password and return a fake user (Eden Treaty demo)
      const user = {
        id: crypto.randomUUID(),
        username: body.username,
        displayName: body.username,
        loggedAt: new Date().toISOString(),
      };
      return user;
    },
    { body: loginBody, response: userSchema }
  )
  .get("/auth/me", () => {
    // Demo: no real auth; could check Authorization header in real app
    return { message: "Use POST /auth/login to get a user. Eden Treaty shares these types with the frontend." };
  })
  .listen({ port, hostname });

export type App = typeof app;

console.log(`API listening at http://${hostname}:${app.server?.port ?? port}`);
