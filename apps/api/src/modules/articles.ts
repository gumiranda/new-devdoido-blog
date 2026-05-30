import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { slugify } from '../lib/validation';

export const articlesModule = new Elysia({ prefix: '/articles' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const articles = await db.query.article.findMany({
      where: (a, { eq: e }) => e(a.workspaceId, workspaceId),
      with: { tags: { with: { tag: true } } },
      orderBy: (a, { desc: d }) => [d(a.updatedAt)],
    });

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      slug: a.slug,
      status: a.status,
      source: a.source,
      category: a.category,
      sourceLabel: a.sourceLabel,
      gradient: a.gradient,
      letter: a.letter,
      views: a.views,
      publishedAt: a.publishedAt,
      indexState: a.indexState,
      indexCoverage: a.indexCoverage,
      indexCrawledAt: a.indexCrawledAt,
      indexCheckedAt: a.indexCheckedAt,
      moderationStatus: a.moderationStatus,
      tags: a.tags.map((tr: any) => tr.tag?.name).filter(Boolean),
      updatedAt: a.updatedAt,
    }));
  })
  .post('/', async ({ workspaceId, body }: any) => {
    const s = body.slug ?? slugify(body.title);

    const existing = await db.query.article.findFirst({
      where: (a, { eq: e, and: an }) => an(e(a.workspaceId, workspaceId), e(a.slug, s)),
    });
    if (existing) throw new Error('Slug already taken');

    const [article] = await db
      .insert(schema.article)
      .values({
        workspaceId,
        authorId: body.authorId,
        title: body.title,
        subtitle: body.subtitle ?? '',
        slug: s,
        contentHtml: body.contentHtml ?? '',
        excerpt: body.excerpt ?? '',
        category: body.category ?? 'Node.js',
        status: body.status ?? 'draft',
        source: body.source ?? 'manual',
        sourceLabel: body.sourceLabel ?? '',
        gradient: body.gradient,
        letter: body.letter,
      })
      .returning();

    return article;
  })
  .patch('/:id', async ({ workspaceId, params, body }: any) => {
    const [article] = await db
      .update(schema.article)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(schema.article.id, params.id), eq(schema.article.workspaceId, workspaceId)))
      .returning();

    return article;
  })
  .get('/slug-available', async ({ query }: any) => {
    const existing = await db.query.article.findFirst({
      where: (a, { eq: e }) => e(a.slug, query.slug),
    });
    return { available: !existing };
  })
  .post('/:id/moderate', async ({ params }: any) => {
    return {
      id: params.id,
      moderationStatus: 'approved',
      message: 'Moderation stub — always approved',
    };
  });
