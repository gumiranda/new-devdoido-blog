import { Elysia } from "elysia";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { articleTag, articleTagRelation } from "../db/schema";
import { authGuard } from "../auth/guard";

export const tags = new Elysia({ prefix: "/tags" }).use(authGuard).get("/", ({ workspaceId }) =>
  db
    .select({
      id: articleTag.id,
      name: articleTag.name,
      slug: articleTag.slug,
      color: articleTag.color,
      count: sql<number>`count(${articleTagRelation.articleId})::int`,
    })
    .from(articleTag)
    .leftJoin(articleTagRelation, eq(articleTagRelation.tagId, articleTag.id))
    .where(eq(articleTag.workspaceId, workspaceId))
    .groupBy(articleTag.id)
    .orderBy(articleTag.name)
);
