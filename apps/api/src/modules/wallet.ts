import { Elysia } from "elysia";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { wallet, creditTransaction } from "../db/schema";
import { authGuard } from "../auth/guard";

export const walletModule = new Elysia({ prefix: "/wallet" }).use(authGuard).get("/", async ({ workspaceId }) => {
  const [w] = await db.select().from(wallet).where(eq(wallet.workspaceId, workspaceId)).limit(1);

  // Consumption aggregated by category (expenses only).
  const consumption = await db
    .select({
      category: creditTransaction.category,
      total: sql<number>`(-sum(${creditTransaction.amount}))::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(creditTransaction)
    .where(and(eq(creditTransaction.workspaceId, workspaceId), eq(creditTransaction.type, "expense")))
    .groupBy(creditTransaction.category);

  const history = await db
    .select()
    .from(creditTransaction)
    .where(eq(creditTransaction.workspaceId, workspaceId))
    .orderBy(desc(creditTransaction.createdAt))
    .limit(20);

  return { wallet: w ?? null, consumption, history };
});
