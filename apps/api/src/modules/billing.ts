import { Elysia, t } from "elysia";
import { desc, eq } from "drizzle-orm";
import { db, creditWallet } from "../db/client";
import { payment, wallet } from "../db/schema";
import { authGuard } from "../auth/guard";
import { PLAN_CREDITS, type PlanName } from "../lib/plans";

export const billing = new Elysia({ prefix: "/billing" })
  .use(authGuard)
  .get("/payments", ({ workspaceId }) =>
    db.select().from(payment).where(eq(payment.workspaceId, workspaceId)).orderBy(desc(payment.createdAt))
  )
  /**
   * Checkout — STUB. Creates a `payment`, then immediately simulates "paid" and
   * credits the wallet. Real Pix (Abacate Pay) / card (Stripe) flow + webhooks are TODO.
   */
  .post(
    "/checkout",
    async ({ workspaceId, body }) => {
      const provider = body.provider ?? (body.method === "pix" ? "abacatepay" : "stripe");
      const credits =
        body.kind === "subscription" && body.planName
          ? PLAN_CREDITS[body.planName as PlanName]
          : body.credits ?? 0;

      const [pay] = await db
        .insert(payment)
        .values({
          workspaceId,
          provider,
          kind: body.kind,
          method: body.method,
          credits,
          amountCents: body.amountCents,
          planName: body.planName,
          status: "pending",
        })
        .returning();

      // --- STUB: simulate successful payment ---
      const balance = await creditWallet(
        workspaceId,
        body.kind === "subscription" ? "monthly_subscription" : "recharge",
        credits,
        body.kind === "subscription" ? `Plano ${body.planName}` : "Recarga de créditos"
      );
      if (body.kind === "subscription" && body.planName) {
        await db
          .update(wallet)
          .set({ plan: body.planName as PlanName, updatedAt: new Date() })
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
        provider: t.Optional(t.Union([t.Literal("abacatepay"), t.Literal("stripe")])),
        credits: t.Optional(t.Integer()),
        amountCents: t.Integer(),
        planName: t.Optional(t.Union([t.Literal("pro"), t.Literal("scale")])),
      }),
    }
  );
