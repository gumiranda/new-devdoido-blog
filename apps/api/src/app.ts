import { Elysia } from "elysia";
import { and, eq, desc, sql } from "drizzle-orm";
import { cors } from "./lib/cors";
import { auth } from "./auth/auth";
import { db } from "./db/client";
import { article, organization } from "./db/schema";
import { publicRateLimit, authenticatedRateLimit } from "./lib/rate-limit";
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
import { publicModule } from "./modules/public";
import { googleModule } from "./modules/google";
import { webhookModule } from "./modules/webhook";
import { uploadModule } from "./modules/upload";
import { gscModule } from "./modules/gsc";
import { seoModule } from "./modules/seo";

/** The composed app WITHOUT `.listen` — importable by tests via `app.handle()`. */
export const app = new Elysia()
  .use(cors)
  // Better Auth handles /api/auth/* (sign-up, sign-in, session, organization plugin).
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .get("/api/health", () => ({ ok: true as const }))
  .get("/api", () => ({ name: "beta-stack-api", version: "2.0.0" }))
  // ── SEO: sitemap + robots (public) ──
  .get("/sitemap.xml", async ({ set }) => {
    const rows = await db
      .select({
        slug: article.slug,
        publishedAt: article.publishedAt,
        orgSlug: organization.slug,
      })
      .from(article)
      .innerJoin(organization, eq(organization.id, article.workspaceId))
      .where(eq(article.status, "published"));

    const baseUrl = "https://devdoido.com.br";
    const urls = rows
      .map(
        (r) =>
          `  <url><loc>${baseUrl}/blog/${r.slug}</loc><lastmod>${r.publishedAt?.toISOString().slice(0, 10) ?? ""}</lastmod></url>`
      )
      .join("\n");

    set.headers["content-type"] = "application/xml";
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  })
  .get("/sitemap-articles.xml", async ({ set }) => {
    const rows = await db
      .select({
        slug: article.slug,
        publishedAt: article.publishedAt,
      })
      .from(article)
      .where(eq(article.status, "published"));

    const baseUrl = "https://devdoido.com.br";
    const urls = rows
      .map(
        (r) =>
          `  <url><loc>${baseUrl}/blog/${r.slug}</loc><lastmod>${r.publishedAt?.toISOString().slice(0, 10) ?? ""}</lastmod></url>`
      )
      .join("\n");

    set.headers["content-type"] = "application/xml";
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  })
  .get("/robots.txt", ({ set }) => {
    const baseUrl = "https://devdoido.com.br";
    set.headers["content-type"] = "text/plain";
    return `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-articles.xml`;
  })
  // ── v1 routes (public + guarded) ──
  .group("/api/v1", (app) =>
    app
      .use(publicRateLimit(100))
      .use(publicModule)
      .use(authenticatedRateLimit)
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
      .use(googleModule)
      .use(webhookModule)
      .use(uploadModule)
      .use(gscModule)
      .use(seoModule)
  );

// Shared with the landing app via Eden Treaty (`apps/landing/src/lib/eden.ts`).
export type App = typeof app;
