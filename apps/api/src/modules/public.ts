/**
 * Public API — no auth required.
 * Used by the landing blog (SSG/SSR), feed readers, and external consumers.
 *
 * Routes:
 *  GET /api/v1/public/articles        — published articles (paginated, filterable)
 *  GET /api/v1/public/articles/:slug  — single article by workspace slug + article slug
 *  GET /api/v1/public/feed            — cross-workspace published feed
 *  GET /api/v1/public/saas            — list of public workspaces (SaaS directory)
 *  GET /api/v1/public/categories      — all categories across public workspaces
 */
import { Elysia, t } from "elysia";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { article, organization, workspaceSettings, articleTag, articleTagRelation } from "../db/schema";

export const publicModule = new Elysia({ prefix: "/public" })

  // Published articles — filtered by workspace, category, tag, search
  .get(
    "/articles",
    async ({ query }) => {
      const conds = [
        eq(article.status, "published"),
        sql`${article.moderationStatus} NOT IN ('flagged', 'blocked')`,
      ];

      if (query.workspace) {
        const [org] = await db
          .select({ id: organization.id })
          .from(organization)
          .where(eq(organization.slug, query.workspace))
          .limit(1);
        if (org) conds.push(eq(article.workspaceId, org.id));
        else return [];
      }

      if (query.category) conds.push(eq(article.category, query.category));
      if (query.q) {
        conds.push(
          sql`(${article.title} ILIKE ${`%${query.q}%`} OR ${article.excerpt} ILIKE ${`%${query.q}%`})`
        );
      }
      if (query.tag) {
        const sub = db
          .select({ id: articleTagRelation.articleId })
          .from(articleTagRelation)
          .innerJoin(articleTag, eq(articleTag.id, articleTagRelation.tagId))
          .where(eq(articleTag.slug, query.tag));
        conds.push(sql`${article.id} IN (${sub})`);
      }

      const page = Math.max(1, query.page ?? 1);
      const perPage = Math.min(50, query.perPage ?? 20);
      const offset = (page - 1) * perPage;

      const rows = await db
        .select({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle,
          slug: article.slug,
          excerpt: article.excerpt,
          coverUrl: article.coverUrl,
          category: article.category,
          publishedAt: article.publishedAt,
          views: article.views,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          ogImageUrl: article.ogImageUrl,
          twitterCard: article.twitterCard,
          answerBox: article.answerBox,
          workspaceId: article.workspaceId,
        })
        .from(article)
        .where(and(...conds))
        .orderBy(desc(article.publishedAt))
        .limit(perPage)
        .offset(offset);

      return rows;
    },
    {
      query: t.Object({
        workspace: t.Optional(t.String()),
        category: t.Optional(t.String()),
        tag: t.Optional(t.String()),
        q: t.Optional(t.String()),
        page: t.Optional(t.Integer({ minimum: 1 })),
        perPage: t.Optional(t.Integer({ minimum: 1, maximum: 50 })),
      }),
    }
  )

  // Single article by workspace slug + article slug
  .get(
    "/articles/:workspaceSlug/:slug",
    async ({ params, status }) => {
      const [org] = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, params.workspaceSlug))
        .limit(1);
      if (!org) return status(404, "Workspace not found");

      const [row] = await db
        .select()
        .from(article)
        .where(
          and(
            eq(article.workspaceId, org.id),
            eq(article.slug, params.slug),
            eq(article.status, "published"),
            sql`${article.moderationStatus} NOT IN ('flagged', 'blocked')`
          )
        )
        .limit(1);

      if (!row) return status(404, "Article not found");

      const tags = await db
        .select({ id: articleTag.id, name: articleTag.name, slug: articleTag.slug })
        .from(articleTagRelation)
        .innerJoin(articleTag, eq(articleTag.id, articleTagRelation.tagId))
        .where(eq(articleTagRelation.articleId, row.id));

      return { ...row, tags };
    },
    {
      params: t.Object({
        workspaceSlug: t.String(),
        slug: t.String(),
      }),
    }
  )

  // Cross-workspace feed (all published, not flagged)
  .get(
    "/feed",
    async ({ query }) => {
      const conds = [
        eq(article.status, "published"),
        sql`${article.moderationStatus} NOT IN ('flagged', 'blocked')`,
      ];
      const page = Math.max(1, query?.page ?? 1);
      const perPage = Math.min(50, query?.perPage ?? 20);

      return db
        .select({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          coverUrl: article.coverUrl,
          category: article.category,
          publishedAt: article.publishedAt,
          workspaceId: article.workspaceId,
        })
        .from(article)
        .where(and(...conds))
        .orderBy(desc(article.publishedAt))
        .limit(perPage)
        .offset((page - 1) * perPage);
    },
    {
      query: t.Object({
        page: t.Optional(t.Integer({ minimum: 1 })),
        perPage: t.Optional(t.Integer({ minimum: 1, maximum: 50 })),
      }),
    }
  )

  // SaaS directory — public workspace profiles
  .get("/saas", async () => {
    const rows = await db
      .select({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
        blogSlug: workspaceSettings.blogSlug,
        category: workspaceSettings.category,
        color: workspaceSettings.color,
        description: workspaceSettings.description,
        website: workspaceSettings.website,
        instagram: workspaceSettings.instagram,
        coverUrl: workspaceSettings.coverUrl,
        logoUrl: workspaceSettings.logoUrl,
      })
      .from(organization)
      .innerJoin(workspaceSettings, eq(workspaceSettings.workspaceId, organization.id));

    return rows;
  })

  // Categories from all published articles
  .get("/categories", async ({ query }) => {
    const conds: any[] = [
      eq(article.status, "published"),
      sql`${article.moderationStatus} NOT IN ('flagged', 'blocked')`,
    ];

    if (query.workspace) {
      const [org] = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, query.workspace))
        .limit(1);
      if (!org) return [];
      conds.push(eq(article.workspaceId, org.id));
    }

    const rows = await db
      .selectDistinct({ category: article.category })
      .from(article)
      .where(and(...conds));

    return rows.filter((r) => r.category != null).map((r) => r.category);
  }, {
    query: t.Object({
      workspace: t.Optional(t.String()),
    }),
  });
