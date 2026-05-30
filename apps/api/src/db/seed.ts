import { db } from './client';
import * as schema from './schema';

async function seed() {
  console.log('Seeding database...');

  // 1. Create a dev user
  const userId = 'user_dev_001';
  await db.insert(schema.user).values({
    id: userId,
    name: 'Gustavo Miranda',
    email: 'gustavo@devdoido.com.br',
    emailVerified: true,
  }).onConflictDoNothing();

  // 2. Create a workspace (organization)
  const orgId = 'org_devdoido_001';
  await db.insert(schema.organization).values({
    id: orgId,
    name: 'DEVDOIDO',
    slug: 'devdoido',
  }).onConflictDoNothing();

  await db.insert(schema.member).values({
    id: 'member_001',
    organizationId: orgId,
    userId,
    role: 'owner',
  }).onConflictDoNothing();

  // 3. Workspace settings
  await db.insert(schema.workspaceSettings).values({
    workspaceId: orgId,
    blogSlug: 'blog',
    category: 'Blog / Conteúdo',
    color: 'hsl(217 91% 55%)',
    description: 'Blog sobre programação, IA, SaaS e carreira dev.',
    website: 'https://devdoido.com.br',
    instagram: '@devdoido',
  }).onConflictDoNothing();

  // 4. Google connection
  const connId = 'gc_devdoido_001';
  await db.insert(schema.googleConnection).values({
    id: connId,
    workspaceId: orgId,
    accountEmail: 'devdoido.bot@gmail.com',
    avatarLetter: 'D',
    authorizedAt: new Date('2026-04-14'),
    tokenRenewedAt: new Date(),
    tokenExpiresAt: new Date(Date.now() + 3600000),
  }).onConflictDoNothing();

  // 5. Channels
  const channels = [
    { id: 'ch_rkt', name: 'Rocketseat', handle: '@rocketseat', youtubeChannelId: 'UCSfwM5u0Kf33Bnzwd9rocket', color: 'linear-gradient(135deg,#8257e6,#6420aa)', letter: 'R', subscribers: 2100000, active: true },
    { id: 'ch_fil', name: 'Filipe Deschamps', handle: '@FilipeDeschamps', youtubeChannelId: 'UCRWqwD1', color: 'linear-gradient(135deg,#06b6d4,#0e7490)', letter: 'F', subscribers: 1600000, active: true },
    { id: 'ch_cft', name: 'Código Fonte TV', handle: '@codigofontetv', youtubeChannelId: 'UClbYj', color: 'linear-gradient(135deg,#f59e0b,#b45309)', letter: 'C', subscribers: 1200000, active: false },
  ];

  for (const ch of channels) {
    await db.insert(schema.channel).values({
      id: ch.id,
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
    }).onConflictDoNothing();
  }

  // 6. Videos
  const videos = [
    { channelId: 'ch_rkt', title: 'Next.js 16: o que muda na prática', durationSeconds: 1104, wordCount: 3412, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)', transcript: 'Fala pessoal, beleza? Hoje a gente vai falar sobre o Next.js 16 e tudo que mudou nessa versão. A primeira grande mudança é no sistema de cache. Eles repensaram completamente como o cache funciona no App Router. Antes, o comportamento padrão confundia bastante gente. Agora tem um controle explícito pra cada fetch. Outra coisa importante: os Server Actions ficaram estáveis e ganharam suporte melhor pra revalidação.' },
    { channelId: 'ch_rkt', title: 'Como estruturar um monorepo com Turborepo', durationSeconds: 1450, wordCount: 4108, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#7c3aed,#4c1d95)', transcript: 'Monorepo é uma daquelas coisas que parece complicada até você fazer pela primeira vez. Vou mostrar como configurar o Turborepo.' },
    { channelId: 'ch_fil', title: 'Construindo um sistema de filas do zero', durationSeconds: 2512, wordCount: 7220, status: 'processing' as const, thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)', transcript: null },
    { channelId: 'ch_cft', title: 'O que é Clean Architecture de verdade', durationSeconds: 930, wordCount: 2890, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#f59e0b,#92400e)', transcript: 'Clean Architecture não é sobre camadas, é sobre dependências. O Uncle Bob explicou isso há anos, mas o mercado transformou em dogma.' },
    { channelId: 'ch_rkt', title: 'React Server Components explicado', durationSeconds: 1268, wordCount: 3940, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#6d28d9,#4c1d95)', transcript: 'Server Components mudam completamente como pensamos sobre renderização no React. Não é só performance — é uma mudança de arquitetura.' },
    { channelId: 'ch_fil', title: 'Postgres: índices que você não usa mas deveria', durationSeconds: 1994, wordCount: 6012, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#0891b2,#0c4a6e)', transcript: 'Índices parciais, expressões, BRIN, GIN, GiST — tem muito mais que B-tree. Vou mostrar casos reais onde cada um faz diferença absurda.' },
    { channelId: 'ch_cft', title: 'TypeScript avançado: generics na prática', durationSeconds: 1185, wordCount: 3510, status: 'queued' as const, thumbGrad: 'linear-gradient(135deg,#d97706,#92400e)', transcript: null },
    { channelId: 'ch_rkt', title: 'Deploy na AWS sem quebrar o orçamento', durationSeconds: 1650, wordCount: 4880, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)', transcript: 'Lambda, ECS, EC2, Lightsail — tanta opção que a conta vem alta sem você perceber. Vou mostrar como escolher a certa pro seu projeto.' },
    { channelId: 'ch_fil', title: 'Como funciona o event loop do Node.js', durationSeconds: 2282, wordCount: 6740, status: 'done' as const, thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)', transcript: 'Entender o event loop é a diferença entre um dev que debuga e um que chuta. Vou desenhar cada fase: timers, pending callbacks, idle, poll, check, close.' },
  ];

  for (const v of videos) {
    await db.insert(schema.video).values({
      channelId: v.channelId,
      title: v.title,
      durationSeconds: v.durationSeconds,
      wordCount: v.wordCount,
      status: v.status,
      thumbGrad: v.thumbGrad,
      transcript: v.transcript,
      publishedAt: new Date('2026-05-29'),
    }).onConflictDoNothing();
  }

  // 7. Runs
  const runs = [
    { startedAt: new Date('2026-05-29T08:00:00'), finishedAt: new Date('2026-05-29T08:02:14'), status: 'ok' as const, channelsCount: 3, newVideos: 6, transcribedCount: 6, durationSeconds: 134, quotaUsed: 412 },
    { startedAt: new Date('2026-05-28T08:00:00'), finishedAt: new Date('2026-05-28T08:01:52'), status: 'ok' as const, channelsCount: 3, newVideos: 4, transcribedCount: 4, durationSeconds: 112, quotaUsed: 412 },
    { startedAt: new Date('2026-05-27T08:00:00'), finishedAt: new Date('2026-05-27T08:03:40'), status: 'partial' as const, channelsCount: 3, newVideos: 5, transcribedCount: 3, durationSeconds: 220, quotaUsed: 412 },
    { startedAt: new Date('2026-05-26T08:00:00'), finishedAt: new Date('2026-05-26T08:01:08'), status: 'ok' as const, channelsCount: 3, newVideos: 2, transcribedCount: 2, durationSeconds: 68, quotaUsed: 412 },
    { startedAt: new Date('2026-05-25T08:00:00'), finishedAt: new Date('2026-05-25T08:01:36'), status: 'ok' as const, channelsCount: 3, newVideos: 3, transcribedCount: 3, durationSeconds: 96, quotaUsed: 412 },
  ];

  for (const r of runs) {
    await db.insert(schema.run).values({
      workspaceId: orgId,
      startedAt: r.startedAt,
      finishedAt: r.finishedAt,
      status: r.status,
      channelsCount: r.channelsCount,
      newVideos: r.newVideos,
      transcribedCount: r.transcribedCount,
      durationSeconds: r.durationSeconds,
      quotaUsed: r.quotaUsed,
    }).onConflictDoNothing();
  }

  // 8. Tags
  const tags = [
    { name: 'nextjs', slug: 'nextjs' },
    { name: 'cache', slug: 'cache' },
    { name: 'react', slug: 'react' },
    { name: 'server-actions', slug: 'server-actions' },
    { name: 'carreira', slug: 'carreira' },
    { name: 'ia', slug: 'ia' },
    { name: 'nodejs', slug: 'nodejs' },
    { name: 'postgres', slug: 'postgres' },
    { name: 'typescript', slug: 'typescript' },
    { name: 'clean-architecture', slug: 'clean-architecture' },
    { name: 'devops', slug: 'devops' },
    { name: 'financas', slug: 'financas' },
    { name: 'arquitetura', slug: 'arquitetura' },
    { name: 'banco-de-dados', slug: 'banco-de-dados' },
  ];

  const tagIds: Record<string, string> = {};
  for (const t of tags) {
    const id = `tag_${t.slug}`;
    tagIds[t.slug] = id;
    await db.insert(schema.articleTag).values({
      id,
      workspaceId: orgId,
      name: t.name,
      slug: t.slug,
    }).onConflictDoNothing();
  }

  // 9. Articles
  const articles = [
    { id: 'art_njs16', title: 'Next.js 16 na prática: o novo cache que finalmente faz sentido', slug: 'nextjs-16-cache', status: 'draft' as const, source: 'ia' as const, category: 'Next.js', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'N', tagSlugs: ['nextjs', 'cache', 'react', 'server-actions'] },
    { id: 'art_evl', title: 'Como funciona o event loop do Node.js', slug: 'event-loop-nodejs', status: 'draft' as const, source: 'ia' as const, category: 'Node.js', sourceLabel: 'Filipe Deschamps', gradient: 'linear-gradient(135deg,#06b6d4,#0c4a6e)', letter: 'E', tagSlugs: ['nodejs', 'carreira'] },
    { id: 'art_crs', title: 'Se o Cursor cair, você sabe codar?', slug: 'cursor-cair-saber-codar', status: 'published' as const, source: 'manual' as const, category: 'Carreira', sourceLabel: 'você', gradient: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'C', views: 2400, indexState: 'indexed' as const, indexCoverage: 'URL enviada e indexada', indexCrawledAt: new Date('2026-05-27'), indexCheckedAt: new Date('2026-05-29'), tagSlugs: ['carreira', 'ia'] },
    { id: 'art_cla', title: 'Clean Architecture de verdade: o guia sem hype', slug: 'clean-architecture-guia', status: 'published' as const, source: 'ia' as const, category: 'Arquitetura', sourceLabel: 'Código Fonte TV', gradient: 'linear-gradient(135deg,#f59e0b,#92400e)', letter: 'A', views: 1820, indexState: 'notindexed' as const, indexCoverage: 'Descoberta — não indexada no momento', indexCheckedAt: new Date('2026-05-29'), tagSlugs: ['clean-architecture', 'arquitetura'] },
    { id: 'art_mei', title: 'MEI, ME ou PJ: o que vale a pena pra dev em 2026', slug: 'mei-me-pj-dev-2026', status: 'published' as const, source: 'manual' as const, category: 'Finanças', sourceLabel: 'você', gradient: 'linear-gradient(135deg,#3b82f6,#1e3a8a)', letter: 'M', views: 980, indexState: 'indexed' as const, indexCoverage: 'URL enviada e indexada', indexCrawledAt: new Date('2026-05-26'), indexCheckedAt: new Date('2026-05-28'), tagSlugs: ['financas', 'carreira'] },
    { id: 'art_rsc', title: 'React Server Components explicado de uma vez', slug: 'rsc-explicado', status: 'published' as const, source: 'ia' as const, category: 'React', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#6d28d9,#4c1d95)', letter: 'R', views: 1540, indexState: 'indexed' as const, indexCoverage: 'URL enviada e indexada', indexCrawledAt: new Date('2026-05-26'), indexCheckedAt: new Date('2026-05-28'), tagSlugs: ['react', 'nextjs'] },
    { id: 'art_pgi', title: 'Postgres: índices que você não usa mas deveria', slug: 'postgres-indices', status: 'published' as const, source: 'ia' as const, category: 'Banco de dados', sourceLabel: 'Filipe Deschamps', gradient: 'linear-gradient(135deg,#0891b2,#0c4a6e)', letter: 'P', views: 1210, indexState: 'notindexed' as const, indexCoverage: 'Rastreada — não indexada no momento', indexCrawledAt: new Date('2026-05-25'), indexCheckedAt: new Date('2026-05-27'), tagSlugs: ['postgres', 'banco-de-dados'] },
    { id: 'art_frl', title: 'Como cobrar mais como freelancer sem perder cliente', slug: 'cobrar-mais-freelancer', status: 'published' as const, source: 'manual' as const, category: 'Finanças', sourceLabel: 'você', gradient: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'F', views: 760, indexState: 'unknown' as const, tagSlugs: ['financas', 'carreira'] },
    { id: 'art_tsg', title: 'TypeScript avançado: generics na prática', slug: 'typescript-generics', status: 'draft' as const, source: 'ia' as const, category: 'TypeScript', sourceLabel: 'Código Fonte TV', gradient: 'linear-gradient(135deg,#d97706,#92400e)', letter: 'T', tagSlugs: ['typescript'] },
    { id: 'art_dpl', title: 'Deploy na AWS sem quebrar o orçamento', slug: 'deploy-aws-barato', status: 'archived' as const, source: 'ia' as const, category: 'DevOps', sourceLabel: 'Rocketseat', gradient: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'D', views: 430, indexState: 'excluded' as const, indexCoverage: "Excluída por tag 'noindex'", indexCrawledAt: new Date('2026-05-19'), indexCheckedAt: new Date('2026-05-20'), tagSlugs: ['devops'] },
  ];

  for (const a of articles) {
    await db.insert(schema.article).values({
      id: a.id,
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
      views: a.views ?? 0,
      indexState: a.indexState ?? 'na',
      indexCoverage: a.indexCoverage ?? null,
      indexCrawledAt: a.indexCrawledAt ?? null,
      indexCheckedAt: a.indexCheckedAt ?? null,
      excerpt: a.title,
      contentHtml: `<p>${a.title}</p>`,
    }).onConflictDoNothing();

    for (const tagSlug of a.tagSlugs) {
      const tagId = tagIds[tagSlug];
      if (tagId) {
        await db.insert(schema.articleTagRelation).values({
          articleId: a.id,
          tagId,
        }).onConflictDoNothing();
      }
    }
  }

  // 10. Automation config
  await db.insert(schema.automationConfig).values({
    workspaceId: orgId,
    enabled: true,
    model: 'claude',
    generateOnTranscript: true,
    promptTemplate: `Você é um redator técnico do blog. Escreva um artigo completo em português a partir da transcrição de um vídeo do YouTube.

VÍDEO: {{titulo_video}}
CANAL: {{canal}}
PUBLICADO EM: {{data_publicacao}}

TRANSCRIÇÃO:
{{transcricao}}

INSTRUÇÕES:
- Reescreva o conteúdo com suas próprias palavras, não copie a transcrição.
- Estruture com um título forte, subtítulo e seções com H2/H3.
- Tom direto e técnico, voltado para desenvolvedores. Sem enrolação.
- Use blocos de código quando o vídeo mencionar código.
- Comprimento alvo: 800–1200 palavras.
- Ao final, cite o vídeo original como fonte com o link {{url_video}}.
- Gere também: slug, meta description (até 155 caracteres) e 5 tags.`,
  }).onConflictDoNothing();

  // 11. Schedule config
  await db.insert(schema.scheduleConfig).values({
    workspaceId: orgId,
    frequency: 'daily',
    cronExpr: '0 8 * * *',
    timezone: 'America/Sao_Paulo',
    quotaPerRun: 412,
    nextRunAt: new Date('2026-05-30T08:00:00'),
  }).onConflictDoNothing();

  // 12. Wallet
  await db.insert(schema.wallet).values({
    workspaceId: orgId,
    balance: 1240,
    plan: 'pro',
    planRenewsAt: new Date('2026-06-14'),
    cardLast4: '4242',
  }).onConflictDoNothing();

  // 13. Credit transactions
  const creditTxns = [
    { type: 'expense' as const, action: 'generate_article' as const, detail: 'Geração de artigo · "Next.js 16 na prática"', amount: -25, category: 'article' as const },
    { type: 'expense' as const, action: 'transcribe_minute' as const, detail: 'Transcrição · 6 vídeos', amount: -60, category: 'transcribe' as const },
    { type: 'income' as const, action: 'recharge' as const, detail: 'Recarga via Pix · Abacate Pay', amount: 5000, category: 'recharge' as const },
    { type: 'expense' as const, action: 'index_check' as const, detail: 'Verificação de indexação · lote', amount: -9, category: 'index' as const },
    { type: 'income' as const, action: 'monthly_subscription' as const, detail: 'Renovação mensal · plano Pro', amount: 3000, category: 'subscription' as const },
  ];

  for (const tx of creditTxns) {
    await db.insert(schema.creditTransaction).values({
      workspaceId: orgId,
      type: tx.type,
      action: tx.action,
      detail: tx.detail,
      amount: tx.amount,
      category: tx.category,
    }).onConflictDoNothing();
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
