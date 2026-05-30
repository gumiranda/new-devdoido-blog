import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { slugify } from '../lib/validation';

export const tagsModule = new Elysia({ prefix: '/tags' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const tags = await db.query.articleTag.findMany({
      where: (t, { eq: e }) => e(t.workspaceId, workspaceId),
    });

    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      color: t.color,
    }));
  })
  .post('/', async ({ workspaceId, body }: any) => {
    const s = body.slug ?? slugify(body.name);

    const existing = await db.query.articleTag.findFirst({
      where: (t, { eq: e, and: an }) => an(e(t.workspaceId, workspaceId), e(t.slug, s)),
    });
    if (existing) return existing;

    const [tag] = await db
      .insert(schema.articleTag)
      .values({ workspaceId, name: body.name, slug: s, color: body.color })
      .returning();

    return tag;
  });
