import { Elysia } from 'elysia';
import { auth } from './auth/auth';
import { channelsModule } from './modules/channels';
import { videosModule } from './modules/videos';
import { runsModule } from './modules/runs';
import { articlesModule } from './modules/articles';
import { tagsModule } from './modules/tags';
import { automationModule } from './modules/automation';
import { scheduleModule } from './modules/schedule';
import { walletModule } from './modules/wallet';
import { billingModule } from './modules/billing';
import { workspaceModule } from './modules/workspace';
import { overviewModule } from './modules/overview';

function corsKey(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

const allowedCorsNormalized = new Set(
  (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => corsKey(s))
    .filter(Boolean)
);

function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  if (
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1')
  ) {
    return true;
  }
  return allowedCorsNormalized.has(corsKey(origin));
}

function applyCorsHeaders(origin: string | null, headers: Record<string, string>): void {
  if (!origin || !isOriginAllowed(origin)) return;
  headers['Access-Control-Allow-Origin'] = origin;
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  headers['Access-Control-Allow-Credentials'] = 'true';
}

const port = Number.parseInt(process.env.PORT ?? '', 10) || 3000;
const hostname = process.env.HOST ?? '0.0.0.0';

export const app = new Elysia()
  .use((app) =>
    app.onRequest(({ request, set }) => {
      applyCorsHeaders(request.headers.get('origin'), set.headers as Record<string, string>);
    })
  )
  .options('/*', ({ request, set }) => {
    applyCorsHeaders(request.headers.get('origin'), set.headers as Record<string, string>);
    set.status = 204;
    return new Response(null, { status: 204 });
  })
  .get('/', () => ({ name: 'beta-stack-api', version: '2.0.0' }))
  .get('/health', () => ({ ok: true as const }))
  .all('/api/auth/*', async ({ request }) => {
    return auth.handler(request);
  })
  .use(channelsModule)
  .use(videosModule)
  .use(runsModule)
  .use(articlesModule)
  .use(tagsModule)
  .use(automationModule)
  .use(scheduleModule)
  .use(walletModule)
  .use(billingModule)
  .use(workspaceModule)
  .use(overviewModule)
  .listen({ port, hostname });

export type App = typeof app;

console.log(`API listening at http://${hostname}:${app.server?.port ?? port}`);
