import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT, hostname: env.HOST });

// Shared with the landing app via Eden Treaty (`apps/landing/src/lib/eden.ts`).
export type { App } from "./app";

console.log(`API listening at http://${env.HOST}:${app.server?.port ?? env.PORT}`);
