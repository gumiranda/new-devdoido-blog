import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';

export const runsModule = new Elysia({ prefix: '/runs' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    return db.query.run.findMany({
      where: (r, { eq: e }) => e(r.workspaceId, workspaceId),
      orderBy: (r, { desc: d }) => [d(r.startedAt)],
    });
  })
  .post('/trigger', async ({ workspaceId }) => {
    const [lastRun] = await db.query.run.findMany({
      where: (r, { eq: e }) => e(r.workspaceId, workspaceId),
      orderBy: (r, { desc: d }) => [d(r.startedAt)],
      limit: 1,
    });

    return { message: 'Run triggered (stub)', lastRun };
  });
