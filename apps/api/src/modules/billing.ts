import { Elysia, t } from "elysia";
import { desc, eq } from "drizzle-orm";
import { db, creditWallet } from "../db/client";
import { payment, wallet } from "../db/schema";
import { authGuard } from "../auth/guard";
import { subscriptionLine, topupLine, type CheckoutAmounts, type PaidPlan } from "../lib/plans";

/** Payment provider is derived from the method — never trusted from the client. */
const PROVIDER_BY_METHOD = { pix: "abacatepay", card: "stripe" } as const;

type CheckoutLine = CheckoutAmounts & {
  action: "monthly_subscription" | "recharge";
  detail: string;
  planName: PaidPlan | null;
};

export const billing = new Elysia({ prefix: "/billing" })
  .use(authGuard)
  .get("/payments", ({ workspaceId }) =>
    db.select().from(payment).where(eq(payment.workspaceId, workspaceId)).orderBy(desc(payment.createdAt))
  )
  /**
   * Checkout — STUB. Creates a `payment`, then immediately simulates "paid" and
   * credits the wallet. Real Pix (Abacate Pay) / card (Stripe) flow + webhooks are TODO.
   *
   * Credits and price are ALWAYS derived server-side from `planName` (subscription)
   * or `packIndex` (top-up) — the client only picks WHAT to buy, never the amounts.
   */
  .post(
    "/checkout",
    async ({ workspaceId, body, status }) => {
      const line = resolveCheckout(body);
      if (!line) return status(400, "Invalid checkout selection");

      const provider = PROVIDER_BY_METHOD[body.method];
      const [pay] = await db
        .insert(payment)
        .values({
          workspaceId,
          provider,
          kind: body.kind,
          method: body.method,
          credits: line.credits,
          amountCents: line.amountCents,
          planName: line.planName,
          status: "pending",
        })
        .returning();

      // --- STUB: simulate successful payment ---
      const balance = await creditWallet(workspaceId, line.action, line.credits, line.detail);
      if (line.planName) {
        await db
          .update(wallet)
          .set({ plan: line.planName, updatedAt: new Date() })
          .where(eq(wallet.workspaceId, workspaceId));
      }
      const [paid] = await db
        .update(payment)
        .set({ status: "paid", paidAt: new Date() })
        .where(eq(payment.id, pay.id))
        .returning();

      return { payment: paid, balance };
    },
    {
      body: t.Object({
        kind: t.Union([t.Literal("topup"), t.Literal("subscription")]),
        method: t.Union([t.Literal("pix"), t.Literal("card")]),
        packIndex: t.Optional(t.Integer({ minimum: 0 })),
        planName: t.Optional(t.Union([t.Literal("pro"), t.Literal("scale")])),
      }),
    }
  );

type CheckoutBody = {
  kind: "topup" | "subscription";
  packIndex?: number;
  planName?: PaidPlan;
};

/** Resolve the server-side credit/price line for a checkout, or null if invalid. */
function resolveCheckout(body: CheckoutBody): CheckoutLine | null {
  if (body.kind === "subscription") {
    if (!body.planName) return null;
    return {
      ...subscriptionLine(body.planName),
      action: "monthly_subscription",
      detail: `Plano ${body.planName}`,
      planName: body.planName,
    };
  }
  if (body.packIndex === undefined) return null;
  const amounts = topupLine(body.packIndex);
  if (!amounts) return null;
  return { ...amounts, action: "recharge", detail: "Recarga de créditos", planName: null };
}
