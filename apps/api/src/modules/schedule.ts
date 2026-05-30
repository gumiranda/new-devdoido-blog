import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const scheduleModule = new Elysia({ prefix: '/schedule' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const configs = await db.query.scheduleConfig.findMany({
      where: (sc, { eq: e }) => e(sc.workspaceId, workspaceId),
    });

    return configs[0] ?? {
      frequency: 'daily',
      cronExpr: '0 8 * * *',
      timezone: 'America/Sao_Paulo',
      quotaPerRun: 412,
    };
  })
  .put('/', async ({ workspaceId, body }: any) => {
    const existing = await db.query.scheduleConfig.findFirst({
      where: (sc, { eq: e }) => e(sc.workspaceId, workspaceId),
    });

    if (existing) {
      return (
        await db
          .update(schema.scheduleConfig)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(schema.scheduleConfig.workspaceId, workspaceId))
          .returning()
      )[0];
    }

    return (
      await db
        .insert(schema.scheduleConfig)
        .values({ workspaceId, ...body })
        .returning()
    )[0];
  });
