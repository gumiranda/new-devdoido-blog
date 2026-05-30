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

function txType(delta: number): "income" | "expense" {
  if (delta < 0) return "expense";
  return "income";
}

/**
 * Atomically adjust a workspace wallet by a signed `delta` (negative = debit,
 * positive = credit). Locks the wallet row (`FOR UPDATE`), enforces a sufficient
 * balance on debits, then updates the balance and logs the transaction in the
 * SAME tx. Throws `InsufficientCreditsError` on overdraft. Returns the new balance.
 */
async function adjustWallet(
  workspaceId: string,
  action: CreditAction,
  delta: number,
  detail?: string
): Promise<number> {
  return db.transaction(async (tx) => {
    const [w] = await tx.select().from(wallet).where(eq(wallet.workspaceId, workspaceId)).for("update");
    if (!w) throw new Error(`wallet not found for workspace ${workspaceId}`);
    if (delta < 0 && w.balance < -delta) throw new InsufficientCreditsError(-delta, w.balance);

    const newBalance = w.balance + delta;
    await tx.update(wallet).set({ balance: newBalance, updatedAt: new Date() }).where(eq(wallet.id, w.id));
    await tx.insert(creditTransaction).values({
      workspaceId,
      type: txType(delta),
      action,
      category: ACTION_CATEGORY[action],
      detail,
      amount: delta,
    });
    return newBalance;
  });
}

/** Atomically debit credits from a workspace wallet. Throws on overdraft. */
export function debitCredit(workspaceId: string, action: CreditAction, amount: number, detail?: string) {
  if (amount <= 0) throw new Error("debit amount must be > 0");
  return adjustWallet(workspaceId, action, -amount, detail);
}

/** Atomically credit a workspace wallet (recharge / subscription grant). */
export function creditWallet(workspaceId: string, action: CreditAction, amount: number, detail?: string) {
  if (amount <= 0) throw new Error("credit amount must be > 0");
  return adjustWallet(workspaceId, action, amount, detail);
}
