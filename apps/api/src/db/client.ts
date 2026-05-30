/**
 * Drizzle client over Neon serverless `Pool` (WebSocket) — supports interactive
 * transactions, which credit debits / billing require for atomicity.
 */
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import { env } from "../env";
import * as schema from "./schema";
import { wallet, creditTransaction, type creditAction } from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });
export type DB = typeof db;

export class InsufficientCreditsError extends Error {
  constructor(public required: number, public available: number) {
    super(`Insufficient credits: need ${required}, have ${available}`);
    this.name = "InsufficientCreditsError";
  }
}

type CreditAction = (typeof creditAction.enumValues)[number];

const ACTION_CATEGORY: Record<CreditAction, "article" | "transcribe" | "index" | "recharge" | "subscription"> = {
  transcribe_minute: "transcribe",
  generate_article: "article",
  index_check: "index",
  monthly_subscription: "subscription",
  recharge: "recharge",
};

/**
 * Atomically debit credits from a workspace wallet.
 * Locks the wallet row (`FOR UPDATE`), checks balance, then updates balance and
 * logs the expense in the SAME transaction. Throws `InsufficientCreditsError`.
 * Returns the new balance.
 */
export async function debitCredit(
  workspaceId: string,
  action: CreditAction,
  amount: number,
  detail?: string
): Promise<number> {
  if (amount <= 0) throw new Error("debit amount must be > 0");
  return db.transaction(async (tx) => {
    const [w] = await tx
      .select()
      .from(wallet)
      .where(eq(wallet.workspaceId, workspaceId))
      .for("update");
    if (!w) throw new Error(`wallet not found for workspace ${workspaceId}`);
    if (w.balance < amount) throw new InsufficientCreditsError(amount, w.balance);

    const newBalance = w.balance - amount;
    await tx.update(wallet).set({ balance: newBalance, updatedAt: new Date() }).where(eq(wallet.id, w.id));
    await tx.insert(creditTransaction).values({
      workspaceId,
      type: "expense",
      action,
      category: ACTION_CATEGORY[action],
      detail,
      amount: -amount,
    });
    return newBalance;
  });
}

/** Atomically credit a workspace wallet (recharge / subscription grant). */
export async function creditWallet(
  workspaceId: string,
  action: CreditAction,
  amount: number,
  detail?: string
): Promise<number> {
  if (amount <= 0) throw new Error("credit amount must be > 0");
  return db.transaction(async (tx) => {
    const [w] = await tx
      .select()
      .from(wallet)
      .where(eq(wallet.workspaceId, workspaceId))
      .for("update");
    if (!w) throw new Error(`wallet not found for workspace ${workspaceId}`);

    const newBalance = w.balance + amount;
    await tx.update(wallet).set({ balance: newBalance, updatedAt: new Date() }).where(eq(wallet.id, w.id));
    await tx.insert(creditTransaction).values({
      workspaceId,
      type: "income",
      action,
      category: ACTION_CATEGORY[action],
      detail,
      amount,
    });
    return newBalance;
  });
}
