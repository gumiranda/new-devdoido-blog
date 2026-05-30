import { Elysia } from "elysia";
import { env } from "./env";
import { cors } from "./lib/cors";
import { auth } from "./auth/auth";
import { overview } from "./modules/overview";
import { channels } from "./modules/channels";
import { videos } from "./modules/videos";
import { runs } from "./modules/runs";
import { articles } from "./modules/articles";
import { tags } from "./modules/tags";
import { automation } from "./modules/automation";
import { schedule } from "./modules/schedule";
import { walletModule } from "./modules/wallet";
import { billing } from "./modules/billing";
import { workspace } from "./modules/workspace";

export const app = new Elysia()
  .use(cors)
  // Better Auth handles /api/auth/* (sign-up, sign-in, session, organization plugin).
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .get("/", () => ({ name: "beta-stack-api", version: "2.0.0" }))
  .get("/health", () => ({ ok: true as const }))
  .use(overview)
  .use(channels)
  .use(videos)
  .use(runs)
  .use(articles)
  .use(tags)
  .use(automation)
  .use(schedule)
  .use(walletModule)
  .use(billing)
  .use(workspace)
  .listen({ port: env.PORT, hostname: env.HOST });

// Shared with the landing app via Eden Treaty (`apps/landing/src/lib/eden.ts`).
export type App = typeof app;

console.log(`API listening at http://${env.HOST}:${app.server?.port ?? env.PORT}`);
