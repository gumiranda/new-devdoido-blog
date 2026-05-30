import { db } from './client';
import * as schema from './schema';

function uid(): string {
  return crypto.randomUUID();
}

async function seed() {
  console.log('Seeding database...');

  // 1. Create or get dev user
  const user = await db.query.user.findFirst({
    where: (u, { eq: e }) => e(u.email, 'gustavo@devdoido.com.br'),
  });
  let userId: string;
  if (!user) {
    userId = uid();
    await db.insert(schema.user).values({
      id: userId,
      name: 'Gustavo Miranda',
      email: 'gustavo@devdoido.com.br',
      emailVerified: true,
    });
  } else {
    userId = user.id;
  }

  // 2. Create or get workspace (organization)
  const org = await db.query.organization.findFirst({
    where: (o, { eq: e }) => e(o.slug, 'devdoido'),
  });
  let orgId: string;
  if (!org) {
    orgId = uid();
    await db.insert(schema.organization).values({
      id: orgId,
      name: 'DEVDOIDO',
      slug: 'devdoido',
    });
  } else {
    orgId = org.id;
  }

  // Membership
  const memExists = await db.query.member.findFirst({
    where: (m, { eq: e, and: an }) =>
      an(e(m.organizationId, orgId), e(m.userId, userId)),
  });
  if (!memExists) {
    await db.insert(schema.member).values({
      id: uid(),
      organizationId: orgId,
      userId,
      role: 'owner',
    });
  }

  // 3. Workspace settings
  const wsExists = await db.query.workspaceSettings.findFirst({
    where: (ws, { eq: e }) => e(ws.workspaceId, orgId),
  });
  if (!wsExists) {
    await db.insert(schema.workspaceSettings).values({
      workspaceId: orgId,
      blogSlug: 'blog',
      category: 'Blog / Conteudo',
      color: 'hsl(217 91% 55%)',
      description: 'Blog sobre programacao, IA, SaaS e carreira dev.',
      website: 'https://devdoido.com.br',
      instagram: '@devdoido',
    });
  }

  // 4. Google connection
  const conn = await db.query.googleConnection.findFirst({
    where: (gc, { eq: e }) => e(gc.workspaceId, orgId),
  });
  let connId: string;
  if (!conn) {
    connId = uid();
    await db.insert(schema.googleConnection).values({
      id: connId,
      workspaceId: orgId,
      accountEmail: 'devdoido.bot@gmail.com',
      avatarLetter: 'D',
      authorizedAt: new Date('2026-04-14'),
      tokenRenewedAt: new Date(),
      tokenExpiresAt: new Date(Date.now() + 3600000),
    });
  } else {
    connId = conn.id;
  }

  // 5. Channels
  const channelDefs = [
    { name: 'Rocketseat', handle: '@rocketseat', youtubeChannelId: 'UCSfwM5u0Kf33Bnzwd9rocket', color: 'linear-gradient(135deg,#8257e6,#6420aa)', letter: 'R', subscribers: 2100000, active: true },
    { name: 'Filipe Deschamps', handle: '@FilipeDeschamps', youtubeChannelId: 'UCRWqwD1abc', color: 'linear-gradient(135deg,#06b6d4,#0e7490)', letter: 'F', subscribers: 1600000, active: true },
    { name: 'Codigo Fonte TV', handle: '@codigofontetv', youtubeChannelId: 'UClbYj678xyz', color: 'linear-gradient(135deg,#f59e0b,#b45309)', letter: 'C', subscribers: 1200000, active: false },
  ];

  const channelIds: Record<string, string> = {};
  for (const ch of channelDefs) {
    const exists = await db.query.channel.findFirst({
      where: (c, { eq: e }) => e(c.handle, ch.handle),
    });
    if (exists) {
      channelIds[ch.name] = exists.id;
      continue;
    }
    const id = uid();
    channelIds[ch.name] = id;
    await db.insert(schema.channel).values({
      id,
      workspaceId: orgId,
      googleConnectionId: connId,
      name: ch.name,
      handle: ch.handle,
      youtubeChannelId: ch.youtubeChannelId,
      color: ch.color,
      letter: ch.letter,
      subscribers: ch.subscribers,
      active: ch.active,
      lastVideoLabel: ch.active ? 'capturado hoje 08:00' : 'capturado ontem',
    });
  }

  // 6. Videos
  const videoDefs = [
    { channelName: 'Rocketseat', title: 'Next.js 16: o que muda na pratica', dur: 1104, words: 3412, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { channelName: 'Rocketseat', title: 'Como estruturar um monorepo com Turborepo', dur: 1450, words: 4108, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
    { channelName: 'Filipe Deschamps', title: 'Construindo um sistema de filas do zero', dur: 2512, words: 7220, status: 'processing' as const, thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)' },
    { channelName: 'Codigo Fonte TV', title: 'O que e Clean Architecture de verdade', dur: 930, words: 2890, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#f59e0b,#92400e)' },
    { channelName: 'Rocketseat', title: 'React Server Components explicado', dur: 1268, words: 3940, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#6d28d9,#4c1d95)' },
    { channelName: 'Filipe Deschamps', title: 'Postgres: indices que voce nao usa mas deveria', dur: 1994, words: 6012, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#0891b2,#0c4a6e)' },
    { channelName: 'Codigo Fonte TV', title: 'TypeScript avancado: generics na pratica', dur: 1185, words: 3510, status: 'queued' as const, thumbGrad: 'linear-gradient(135deg,#d97706,#92400e)' },
    { channelName: 'Rocketseat', title: 'Deploy na AWS sem quebrar o orcamento', dur: 1650, words: 4880, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { channelName: 'Filipe Deschamps', title: 'Como funciona o event loop do Node.js', dur: 2282, words: 6740, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)' },
  ];

  for (const v of videoDefs) {
    const cId = channelIds[v.channelName];
    if (!cId) continue;
    const exists = await db.query.video.findFirst({
      where: (vi, { eq: e, and: an }) =>
        an(e(vi.title, v.title), e(vi.channelId, cId)),
    });
    if (exists) continue;
    await db.insert(schema.video).values({
      channelId: cId,
      title: v.title,
      durationSeconds: v.dur,
      wordCount: v.words,
      status: v.status,
      thumbGrad: v.thumbGrad,
      publishedAt: new Date('2026-05-29'),
    });
  }

  // 7. Runs
  const runDefs = [
    { startedAt: '2026-05-29T08:00:00', finishedAt: '2026-05-29T08:02:14', status: 'ok' as const, chans: 3, news: 6, done: 6, dur: 134, quota: 412 },
    { startedAt: '2026-05-28T08:00:00', finishedAt: '2026-05-28T08:01:52', status: 'ok' as const, chans: 3, news: 4, done: 4, dur: 112, quota: 412 },
    { startedAt: '2026-05-27T08:00:00', finishedAt: '2026-05-27T08:03:40', status: 'partial' as const, chans: 3, news: 5, done: 3, dur: 220, quota: 412 },
    { startedAt: '2026-05-26T08:00:00', finishedAt: '2026-05-26T08:01:08', status: 'ok' as const, chans: 3, news: 2, done: 2, dur: 68, quota: 412 },
    { startedAt: '2026-05-25T08:00:00', finishedAt: '2026-05-25T08:01:36', status: 'ok' as const, chans: 3, news: 3, done: 3, dur: 96, quota: 412 },
  ];

  for (const r of runDefs) {
    const exists = await db.query.run.findFirst({
      where: (ru, { eq: e, and: an }) =>
        an(e(ru.workspaceId, orgId), e(ru.startedAt, new Date(r.startedAt))),
    });
    if (exists) continue;
    await db.insert(schema.run).values({
      workspaceId: orgId,
      startedAt: new Date(r.startedAt),
      finishedAt: new Date(r.finishedAt),
      status: r.status,
      channelsCount: r.chans,
      newVideos: r.news,
      transcribedCount: r.done,
      durationSeconds: r.dur,
      quotaUsed: r.quota,
    });
  }

  // 8. Tags
  const tagDefs = [
    'nextjs', 'cache', 'react', 'server-actions', 'carreira', 'ia', 'nodejs',
    'postgres', 'typescript', 'clean-architecture', 'devops', 'financas',
    'arquitetura', 'banco-de-dados',
  ];

  const tagIds: Record<string, string> = {};
  for (const slug of tagDefs) {
    const existing = await db.query.articleTag.findFirst({
      where: (t, { eq: e, and: an }) => an(e(t.workspaceId, orgId), e(t.slug, slug)),
    });
    if (existing) {
      tagIds[slug] = existing.id;
      continue;
    }
    const id = uid();
    tagIds[slug] = id;
    await db.insert(schema.articleTag).values({
      id,
      workspaceId: orgId,
      name: slug,
      slug,
    });
  }

  // 9. Articles
  const articleDefs = [
    { title: 'Next.js 16 na pratica: o novo cache que finalmente faz sentido', slug: 'nextjs-16-cache', status: 'draft' as const, source: 'ia' as const, category: 'Next.js', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'N', views: 0, tagSlugs: ['nextjs', 'cache', 'react', 'server-actions'], idx: null as any },
    { title: 'Como funciona o event loop do Node.js', slug: 'event-loop-nodejs', status: 'draft' as const, source: 'ia' as const, category: 'Node.js', sourceLabel: 'Filipe Deschamps', gradient: 'linear-gradient(135deg,#06b6d4,#0c4a6e)', letter: 'E', views: 0, tagSlugs: ['nodejs', 'carreira'], idx: null },
    { title: 'Se o Cursor cair, voce sabe codar?', slug: 'cursor-cair-saber-codar', status: 'published' as const, source: 'manual' as const, category: 'Carreira', sourceLabel: 'voce', gradient: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'C', views: 2400, tagSlugs: ['carreira', 'ia'], idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: new Date('2026-05-27'), checked: new Date('2026-05-29') } as any },
    { title: 'Clean Architecture de verdade: o guia sem hype', slug: 'clean-architecture-guia', status: 'published' as const, source: 'ia' as const, category: 'Arquitetura', sourceLabel: 'Codigo Fonte TV', gradient: 'linear-gradient(135deg,#f59e0b,#92400e)', letter: 'A', views: 1820, tagSlugs: ['clean-architecture', 'arquitetura'], idx: { state: 'notindexed', coverage: 'Descoberta — nao indexada no momento', checked: new Date('2026-05-29') } as any },
    { title: 'MEI, ME ou PJ: o que vale a pena pra dev em 2026', slug: 'mei-me-pj-dev-2026', status: 'published' as const, source: 'manual' as const, category: 'Financas', sourceLabel: 'voce', gradient: 'linear-gradient(135deg,#3b82f6,#1e3a8a)', letter: 'M', views: 980, tagSlugs: ['financas', 'carreira'], idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: new Date('2026-05-26'), checked: new Date('2026-05-28') } as any },
    { title: 'React Server Components explicado de uma vez', slug: 'rsc-explicado', status: 'published' as const, source: 'ia' as const, category: 'React', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#6d28d9,#4c1d95)', letter: 'R', views: 1540, tagSlugs: ['react', 'nextjs'], idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: new Date('2026-05-26'), checked: new Date('2026-05-28') } as any },
    { title: 'Postgres: indices que voce nao usa mas deveria', slug: 'postgres-indices', status: 'published' as const, source: 'ia' as const, category: 'Banco de dados', sourceLabel: 'Filipe Deschamps', gradient: 'linear-gradient(135deg,#0891b2,#0c4a6e)', letter: 'P', views: 1210, tagSlugs: ['postgres', 'banco-de-dados'], idx: { state: 'notindexed', coverage: 'Rastreada — nao indexada no momento', crawl: new Date('2026-05-25'), checked: new Date('2026-05-27') } as any },
    { title: 'Como cobrar mais como freelancer sem perder cliente', slug: 'cobrar-mais-freelancer', status: 'published' as const, source: 'manual' as const, category: 'Financas', sourceLabel: 'voce', gradient: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'F', views: 760, tagSlugs: ['financas', 'carreira'], idx: { state: 'unknown' } as any },
    { title: 'TypeScript avancado: generics na pratica', slug: 'typescript-generics', status: 'draft' as const, source: 'ia' as const, category: 'TypeScript', sourceLabel: 'Codigo Fonte TV', gradient: 'linear-gradient(135deg,#d97706,#92400e)', letter: 'T', views: 0, tagSlugs: ['typescript'], idx: null },
    { title: 'Deploy na AWS sem quebrar o orcamento', slug: 'deploy-aws-barato', status: 'archived' as const, source: 'ia' as const, category: 'DevOps', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'D', views: 430, tagSlugs: ['devops'], idx: { state: 'excluded', coverage: "Excluida por tag 'noindex'", crawl: new Date('2026-05-19'), checked: new Date('2026-05-20') } as any },
  ];

  for (const a of articleDefs) {
    const exists = await db.query.article.findFirst({
      where: (ar, { eq: e, and: an }) => an(e(ar.workspaceId, orgId), e(ar.slug, a.slug)),
    });
    if (exists) continue;

    const articleId = uid();
    await db.insert(schema.article).values({
      id: articleId,
      workspaceId: orgId,
      authorId: userId,
      title: a.title,
      slug: a.slug,
      status: a.status,
      source: a.source,
      category: a.category,
      sourceLabel: a.sourceLabel,
      gradient: a.gradient,
      letter: a.letter,
      views: a.views,
      indexState: a.idx?.state ?? 'na',
      indexCoverage: a.idx?.coverage ?? null,
      indexCrawledAt: a.idx?.crawl ?? null,
      indexCheckedAt: a.idx?.checked ?? null,
      excerpt: a.title,
      contentHtml: `<p>${a.title}</p>`,
    });

    for (const tagSlug of a.tagSlugs) {
      const tagId = tagIds[tagSlug];
      if (tagId) {
        await db.insert(schema.articleTagRelation).values({ articleId, tagId });
      }
    }
  }

  // 10. Automation config
  const acExists = await db.query.automationConfig.findFirst({
    where: (ac, { eq: e }) => e(ac.workspaceId, orgId),
  });
  if (!acExists) {
    await db.insert(schema.automationConfig).values({
      workspaceId: orgId,
      enabled: true,
      model: 'claude',
      generateOnTranscript: true,
      promptTemplate: 'Voce e um redator tecnico do blog. Escreva um artigo completo a partir da transcricao de um video do YouTube.',
    });
  }

  // 11. Schedule config
  const scExists = await db.query.scheduleConfig.findFirst({
    where: (sc, { eq: e }) => e(sc.workspaceId, orgId),
  });
  if (!scExists) {
    await db.insert(schema.scheduleConfig).values({
      workspaceId: orgId,
      frequency: 'daily',
      cronExpr: '0 8 * * *',
      timezone: 'America/Sao_Paulo',
      quotaPerRun: 412,
      nextRunAt: new Date('2026-05-30T08:00:00'),
    });
  }

  // 12. Wallet
  const wExists = await db.query.wallet.findFirst({
    where: (w, { eq: e }) => e(w.workspaceId, orgId),
  });
  if (!wExists) {
    await db.insert(schema.wallet).values({
      workspaceId: orgId,
      balance: 1240,
      plan: 'pro',
      planRenewsAt: new Date('2026-06-14'),
      cardLast4: '4242',
    });
  }

  // 13. Credit transactions (only if empty)
  const txExists = await db.query.creditTransaction.findFirst({
    where: (ct, { eq: e }) => e(ct.workspaceId, orgId),
  });
  if (!txExists) {
    const creditTxns = [
      { type: 'expense' as const, action: 'generate_article' as const, detail: 'Geracao de artigo', amount: -25, category: 'article' as const },
      { type: 'expense' as const, action: 'transcribe_minute' as const, detail: 'Transcricao · 6 videos', amount: -60, category: 'transcribe' as const },
      { type: 'income' as const, action: 'recharge' as const, detail: 'Recarga via Pix · Abacate Pay', amount: 5000, category: 'recharge' as const },
      { type: 'expense' as const, action: 'index_check' as const, detail: 'Verificacao de indexacao · lote', amount: -9, category: 'index' as const },
      { type: 'income' as const, action: 'monthly_subscription' as const, detail: 'Renovacao mensal · plano Pro', amount: 3000, category: 'subscription' as const },
    ];

    for (const tx of creditTxns) {
      await db.insert(schema.creditTransaction).values({
        workspaceId: orgId,
        type: tx.type,
        action: tx.action,
        detail: tx.detail,
        amount: tx.amount,
        category: tx.category,
      });
    }
  }

  console.log('Seed complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
