import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import { eq, count } from 'drizzle-orm';
import * as schema from '../db/schema';

export const overviewModule = new Elysia({ prefix: '/overview' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const [channelsCount] = await db
      .select({ count: count() })
      .from(schema.channel)
      .where(eq(schema.channel.workspaceId, workspaceId));

    const [videosCount] = await db
      .select({ count: count() })
      .from(schema.video);

    const [runsCount] = await db
      .select({ count: count() })
      .from(schema.run)
      .where(eq(schema.run.workspaceId, workspaceId));

    const walletData = await db.query.wallet.findFirst({
      where: (w, { eq: e }) => e(w.workspaceId, workspaceId),
    });

    const scheduleData = await db.query.scheduleConfig.findFirst({
      where: (sc, { eq: e }) => e(sc.workspaceId, workspaceId),
    });

    return {
      channelsCount: channelsCount?.count ?? 0,
      videosCount: videosCount?.count ?? 0,
      runsCount: runsCount?.count ?? 0,
      quotaUsed: 32,
      balance: walletData?.balance ?? 0,
      balanceMax: 3000,
      plan: walletData?.plan ?? 'free',
      nextRunAt: scheduleData?.nextRunAt ?? null,
      frequency: scheduleData?.frequency ?? 'daily',
      timezone: scheduleData?.timezone ?? 'America/Sao_Paulo',
    };
  });
