import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const walletModule = new Elysia({ prefix: '/wallet' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const walletData = await db.query.wallet.findFirst({
      where: (w, { eq: e }) => e(w.workspaceId, workspaceId),
    });

    const transactions = await db.query.creditTransaction.findMany({
      where: (ct, { eq: e }) => e(ct.workspaceId, workspaceId),
      orderBy: (ct, { desc: d }) => [d(ct.createdAt)],
      limit: 50,
    });

    const stats = await db
      .select({
        category: schema.creditTransaction.category,
        totalAmount: sql<number>`sum(${schema.creditTransaction.amount})`.mapWith(Number),
      })
      .from(schema.creditTransaction)
      .where(
        and(
          eq(schema.creditTransaction.workspaceId, workspaceId),
          eq(schema.creditTransaction.type, 'expense'),
        )
      )
      .groupBy(schema.creditTransaction.category);

    return {
      balance: walletData?.balance ?? 0,
      plan: walletData?.plan ?? 'free',
      planRenewsAt: walletData?.planRenewsAt,
      cardLast4: walletData?.cardLast4,
      balanceMax: 3000,
      consumption: stats.map((s) => ({
        category: s.category,
        total: s.totalAmount,
      })),
      transactions,
    };
  });
