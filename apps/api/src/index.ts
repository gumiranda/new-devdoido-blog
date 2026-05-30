import { app } from "./app";
import { env } from "./env";
import { startCronScheduler } from "./lib/cron";

app.listen({ port: env.PORT, hostname: env.HOST });

// Shared with the landing app via Eden Treaty (`apps/landing/src/lib/eden.ts`).
export type { App } from "./app";

// Start in-process cron scheduler (M3.9)
startCronScheduler();

console.log(`API listening at http://${env.HOST}:${app.server?.port ?? env.PORT}`);
