/**
 * Webhook handlers for external service callbacks (M3.2 / M3.7).
 *
 * Routes:
 *  POST /api/v1/webhook/gladia     — Gladia transcription result
 *  POST /api/v1/webhook/abacatepay — AbacatePay payment callback
 *  POST /api/v1/webhook/stripe     — Stripe payment callback
 */

import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { video, payment, wallet, creditTransaction } from "../db/schema";
import { creditWallet } from "../db/client";
import { env } from "../env";

/* ──────── Gladia ──────── */

interface GladiaWebhook {
  id: string;
  status: "done" | "error" | "processing";
  result?: {
    transcription?: {
      full_transcript?: string;
      utterances?: Array<{ words: Array<{ word: string }> }>;
    };
  };
  error?: { message: string };
}

export const webhookModule = new Elysia({ prefix: "/webhook" })

  .post(
    "/gladia",
    async ({ body, status }) => {
      const data = body as GladiaWebhook;
      if (!data.id) return status(400, "Missing transcription ID");

      // Find the video by matching the Gladia ID stored during submission.
      // Gladia doesn't give us a videoId back directly, so we search by the
      // submission ID stored in transcript context.
      // For now, we process all pending videos and match by external workflow.
      const [vid] = await db
        .select()
        .from(video)
        .where(eq(video.transcriptStatus, "processing"))
        .limit(1);

      if (!vid) return { ok: false, reason: "No processing video found" };
      // In production, match by Gladia job ID stored in video metadata

      if (data.status === "done" && data.result?.transcription?.full_transcript) {
        const transcript = data.result.transcription.full_transcript;
        const wordCount = data.result.transcription.utterances?.reduce(
          (sum, u) => sum + (u.words?.length ?? 0),
          0
        ) ?? transcript.split(/\s+/).length;

        await db
          .update(video)
          .set({
            transcript,
            wordCount,
            transcriptStatus: "done",
            transcriptError: null,
          })
          .where(eq(video.id, vid.id));
        return { ok: true, status: "done" };
      }

      if (data.status === "error") {
        await db
          .update(video)
          .set({
            transcriptStatus: "error",
            transcriptError: data.error?.message ?? "Unknown error",
            transcriptRetryCount: (vid.transcriptRetryCount ?? 0) + 1,
          })
          .where(eq(video.id, vid.id));
        return { ok: true, status: "error" };
      }

      return { ok: true, status: data.status };
    },
    { body: t.Any() }
  )

  /* ──────── AbacatePay (Pix) ──────── */

  .post(
    "/abacatepay",
    async ({ body, status, request }) => {
      // Validate webhook signature
      const signature = request.headers.get("x-abacatepay-signature");
      if (!signature || !env.ABACATEPAY_WEBHOOK_SECRET) {
        return status(401, "Missing signature");
      }
      // TODO: verify HMAC signature with ABACATEPAY_WEBHOOK_SECRET

      const data = body as {
        event: string;
        data: { external_id: string; amount: number; status: string };
      };

      if (data.event === "payment.succeeded" && data.data?.external_id) {
        const [pay] = await db
          .select()
          .from(payment)
          .where(eq(payment.externalId, data.data.external_id))
          .limit(1);

        if (pay && pay.status !== "paid") {
          await creditWallet(pay.workspaceId, "recharge", pay.credits, "Recarga via Pix");
          if (pay.planName) {
            await db
              .update(wallet)
              .set({ plan: pay.planName as "pro" | "scale", updatedAt: new Date() })
              .where(eq(wallet.workspaceId, pay.workspaceId));
          }
          await db
            .update(payment)
            .set({ status: "paid", paidAt: new Date() })
            .where(eq(payment.id, pay.id));
        }
      }
      return { ok: true };
    },
    { body: t.Any() }
  )

  /* ──────── Stripe (card) ──────── */

  .post(
    "/stripe",
    async ({ body, status, request }) => {
      const signature = request.headers.get("stripe-signature");
      if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
        return status(401, "Missing signature");
      }
      // TODO: verify Stripe webhook signature using stripe.webhooks.constructEvent()

      const data = body as {
        type: string;
        data: { object: { metadata: { paymentId: string }; status: string } };
      };

      if (data.type === "checkout.session.completed" && data.data?.object?.metadata?.paymentId) {
        const [pay] = await db
          .select()
          .from(payment)
          .where(eq(payment.externalId, data.data.object.metadata.paymentId))
          .limit(1);

        if (pay && pay.status !== "paid") {
          await creditWallet(pay.workspaceId, "recharge", pay.credits, "Recarga via cartão");
          if (pay.planName) {
            await db
              .update(wallet)
              .set({ plan: pay.planName as "pro" | "scale", updatedAt: new Date() })
              .where(eq(wallet.workspaceId, pay.workspaceId));
          }
          await db
            .update(payment)
            .set({ status: "paid", paidAt: new Date() })
            .where(eq(payment.id, pay.id));
        }
      }
      return { ok: true };
    },
    { body: t.Any() }
  );
