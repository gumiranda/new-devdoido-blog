import { Elysia, t } from "elysia";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { article, articleTag, articleTagRelation, moderationResult } from "../db/schema";
import { authGuard } from "../auth/guard";
import { slugify } from "../lib/slug";

type ModStatus = "approved" | "flagged" | "needs_review" | "blocked";

/**
 * Moderation — STUB. Real OpenAI moderation call is TODO. Records a
 * `moderation_result` row and mirrors the verdict onto `article.moderationStatus`.
 */
async function runModeration(articleId: string): Promise<ModStatus> {
  const verdict: ModStatus = "approved"; // TODO: call OpenAI moderation API
  await db.insert(moderationResult).values({
    articleId,
    status: verdict,
    provider: "openai",
    rawResultJson: { stub: true },
  });
  await db
    .update(article)
    .set({ moderationStatus: verdict, moderationCheckedAt: new Date() })
    .where(eq(article.id, articleId));
  return verdict;
}

/** Load an article scoped to its workspace (tenant isolation), or null. */
async function findArticle(workspaceId: string, id: string) {
  const [row] = await db
    .select()
    .from(article)
    .where(and(eq(article.id, id), eq(article.workspaceId, workspaceId)))
    .limit(1);
  return row ?? null;
}

async function getTagsFor(articleId: string) {
  return db
    .select({ id: articleTag.id, name: articleTag.name, slug: articleTag.slug, color: articleTag.color })
    .from(articleTagRelation)
    .innerJoin(articleTag, eq(articleTag.id, articleTagRelation.tagId))
    .where(eq(articleTagRelation.articleId, articleId));
}

export const articles = new Elysia({ prefix: "/articles" })
  .use(authGuard)

  // List with filters: ?status= &tag=slug &moderationStatus= &q=
  .get(
    "/",
    ({ workspaceId, query }) => {
      const conds = [eq(article.workspaceId, workspaceId)];
      if (query.status) conds.push(eq(article.status, query.status as never));
      if (query.moderationStatus) conds.push(eq(article.moderationStatus, query.moderationStatus as never));
      if (query.q) conds.push(ilike(article.title, `%${query.q}%`));
      if (query.tag) {
        const sub = db
          .select({ id: articleTagRelation.articleId })
          .from(articleTagRelation)
          .innerJoin(articleTag, eq(articleTag.id, articleTagRelation.tagId))
          .where(and(eq(articleTag.workspaceId, workspaceId), eq(articleTag.slug, query.tag)));
        conds.push(inArray(article.id, sub));
      }
      return db.select().from(article).where(and(...conds)).orderBy(desc(article.updatedAt));
    },
    {
      query: t.Object({
        status: t.Optional(t.String()),
        tag: t.Optional(t.String()),
        moderationStatus: t.Optional(t.String()),
        q: t.Optional(t.String()),
      }),
    }
  )

  .get("/slug-available", async ({ workspaceId, query }) => {
    const [row] = await db
      .select({ id: article.id })
      .from(article)
      .where(and(eq(article.workspaceId, workspaceId), eq(article.slug, query.slug)))
      .limit(1);
    return { available: !row };
  }, { query: t.Object({ slug: t.String() }) })

  .get("/:id", async ({ workspaceId, params, status }) => {
    const row = await findArticle(workspaceId, params.id);
    if (!row) return status(404, "Article not found");
    return { ...row, tags: await getTagsFor(row.id) };
  })

  .post(
    "/",
    async ({ workspaceId, userId, body, status }) => {
      const slug = slugify(body.slug || body.title);
      const [dupe] = await db
        .select({ id: article.id })
        .from(article)
        .where(and(eq(article.workspaceId, workspaceId), eq(article.slug, slug)))
        .limit(1);
      if (dupe) return status(409, "Slug already in use");

      const [row] = await db
        .insert(article)
        .values({
          workspaceId,
          authorId: userId,
          title: body.title,
          subtitle: body.subtitle,
          slug,
          contentHtml: body.contentHtml,
          excerpt: body.excerpt,
          coverUrl: body.coverUrl,
          category: body.category,
          source: body.source ?? "manual",
          sourceVideoId: body.sourceVideoId,
        })
        .returning();
      return row;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        subtitle: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        contentHtml: t.Optional(t.String()),
        excerpt: t.Optional(t.String()),
        coverUrl: t.Optional(t.String()),
        category: t.Optional(t.String()),
        source: t.Optional(t.Union([t.Literal("ia"), t.Literal("manual")])),
        sourceVideoId: t.Optional(t.String()),
      }),
    }
  )

  // Update / publish. Publish honors the moderation gate when auto-publish is on.
  .patch(
    "/:id",
    async ({ workspaceId, params, body, status }) => {
      const current = await findArticle(workspaceId, params.id);
      if (!current) return status(404, "Article not found");

      const patch: Record<string, unknown> = { ...body, updatedAt: new Date() };

      if (body.status === "published" && current.status !== "published") {
        const verdict = await runModeration(current.id);
        if (verdict !== "approved") {
          // keep as draft, surface needs-review
          return status(409, { error: "moderation_failed", verdict });
        }
        patch.publishedAt = new Date();
      }

      const [row] = await db
        .update(article)
        .set(patch)
        .where(and(eq(article.id, params.id), eq(article.workspaceId, workspaceId)))
        .returning();
      return row;
    },
    {
      body: t.Partial(
        t.Object({
          title: t.String(),
          subtitle: t.String(),
          contentHtml: t.String(),
          excerpt: t.String(),
          coverUrl: t.String(),
          category: t.String(),
          status: t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("archived")]),
        })
      ),
    }
  )

  .delete("/:id", async ({ workspaceId, params }) => {
    await db.delete(article).where(and(eq(article.id, params.id), eq(article.workspaceId, workspaceId)));
    return { ok: true };
  })

  // Moderate on demand (stub).
  .post("/:id/moderate", async ({ workspaceId, params, status }) => {
    const row = await findArticle(workspaceId, params.id);
    if (!row) return status(404, "Article not found");
    const verdict = await runModeration(row.id);
    return { verdict };
  })

  // Tags: associate (by tagId or name — creates the tag if needed).
  .post(
    "/:id/tags",
    async ({ workspaceId, params, body, status }) => {
      const art = await findArticle(workspaceId, params.id);
      if (!art) return status(404, "Article not found");

      let tagId = body.tagId;
      if (tagId) {
        // The tag MUST belong to this workspace — else a client could attach
        // (and then read back) another tenant's tag.
        const [owned] = await db
          .select({ id: articleTag.id })
          .from(articleTag)
          .where(and(eq(articleTag.id, tagId), eq(articleTag.workspaceId, workspaceId)))
          .limit(1);
        if (!owned) return status(404, "Tag not found");
      } else if (body.name) {
        const slug = slugify(body.name);
        const [existing] = await db
          .select({ id: articleTag.id })
          .from(articleTag)
          .where(and(eq(articleTag.workspaceId, workspaceId), eq(articleTag.slug, slug)))
          .limit(1);
        tagId =
          existing?.id ??
          (await db.insert(articleTag).values({ workspaceId, name: body.name, slug }).returning())[0].id;
      }
      if (!tagId) return status(400, "Provide tagId or name");

      await db.insert(articleTagRelation).values({ articleId: art.id, tagId }).onConflictDoNothing();
      return getTagsFor(art.id);
    },
    { body: t.Object({ tagId: t.Optional(t.String()), name: t.Optional(t.String()) }) }
  )

  .delete("/:id/tags/:tagId", async ({ workspaceId, params, status }) => {
    const art = await findArticle(workspaceId, params.id);
    if (!art) return status(404, "Article not found");
    await db
      .delete(articleTagRelation)
      .where(and(eq(articleTagRelation.articleId, art.id), eq(articleTagRelation.tagId, params.tagId)));
    return getTagsFor(art.id);
  });
