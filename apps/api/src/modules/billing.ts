import { Elysia } from 'elysia';
import { db, debitCredit } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const PACKS = [
  { credits: 1000, priceCents: 1900 },
  { credits: 5000, priceCents: 7900 },
  { credits: 15000, priceCents: 19900 },
];

export const billingModule = new Elysia({ prefix: '/billing' })
  .use(authGuard)
  .get('/packs', () => PACKS)
  .post('/checkout', async ({ workspaceId, body }: any) => {
    const { kind, credits, priceCents, method, planName } = body;

    const discountCents = method === 'pix' ? Math.round(priceCents * 0.05) : 0;

    const [payment] = await db
      .insert(schema.payment)
      .values({
        workspaceId,
        provider: method === 'pix' ? 'abacatepay' : 'stripe',
        kind,
        method,
        credits,
        amountCents: priceCents,
        discountCents,
        status: 'pending',
        planName: planName ?? null,
      })
      .returning();

    return { id: payment.id, status: payment.status, url: null };
  })
  .post('/checkout/:id/confirm', async ({ workspaceId, params }: any) => {
    const payment = await db.query.payment.findFirst({
      where: (p, { eq: e, and: an }) => an(e(p.id, params.id), e(p.workspaceId, workspaceId)),
    });
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error('Payment already processed');

    await db
      .update(schema.payment)
      .set({ status: 'paid', paidAt: new Date() })
      .where(eq(schema.payment.id, params.id));

    await debitCredit(
      workspaceId,
      payment.credits,
      payment.kind === 'subscription' ? 'monthly_subscription' : 'recharge',
      payment.kind === 'subscription'
        ? `Renovação mensal · plano ${payment.planName}`
        : `Recarga via ${payment.method === 'pix' ? 'Pix · Abacate Pay' : 'Stripe'} · pacote ${payment.credits} créditos`,
      payment.kind === 'subscription' ? 'subscription' : 'recharge',
    );

    if (payment.kind === 'subscription') {
      await db
        .update(schema.wallet)
        .set({
          plan: (payment.planName?.toLowerCase() ?? 'pro') as any,
          planRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .where(eq(schema.wallet.workspaceId, workspaceId));
    }

    return { id: payment.id, status: 'paid', credits: payment.credits };
  });
