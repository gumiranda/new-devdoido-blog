import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool, { schema });

export async function debitCredit(
  workspaceId: string,
  amount: number,
  action: string,
  detail: string,
  category: string,
) {
  return db.transaction(async (tx) => {
    const [wallet] = await tx
      .select({ balance: schema.wallet.balance })
      .from(schema.wallet)
      .where(eq(schema.wallet.workspaceId, workspaceId))
      .for('update');

    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance + amount < 0) {
      const err = new Error('Insufficient credits') as any;
      err.code = 'INSUFFICIENT_CREDITS';
      throw err;
    }

    await tx
      .update(schema.wallet)
      .set({ balance: wallet.balance + amount })
      .where(eq(schema.wallet.workspaceId, workspaceId));

    await tx.insert(schema.creditTransaction).values({
      workspaceId,
      type: amount > 0 ? 'income' : 'expense',
      action: action as any,
      detail,
      amount,
      category: category as any,
    });
  });
}
