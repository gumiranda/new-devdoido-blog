import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const workspaceModule = new Elysia({ prefix: '/workspace' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const settings = await db.query.workspaceSettings.findMany({
      where: (ws, { eq: e }) => e(ws.workspaceId, workspaceId),
    });

    return settings[0] ?? {
      blogSlug: 'blog',
      category: 'blog',
      color: 'hsl(217 91% 55%)',
      description: '',
      website: '',
      instagram: '',
      coverUrl: '',
      logoUrl: '',
    };
  })
  .put('/', async ({ workspaceId, body }: any) => {
    const existing = await db.query.workspaceSettings.findFirst({
      where: (ws, { eq: e }) => e(ws.workspaceId, workspaceId),
    });

    if (existing) {
      return (
        await db
          .update(schema.workspaceSettings)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(schema.workspaceSettings.workspaceId, workspaceId))
          .returning()
      )[0];
    }

    return (
      await db
        .insert(schema.workspaceSettings)
        .values({ workspaceId, ...body })
        .returning()
    )[0];
  });
