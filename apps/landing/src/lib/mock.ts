export const MOCK = {
  user: {
    name: 'Gustavo Miranda',
    initials: 'GM',
    email: 'gustavo@faturei.io',
    handle: '@devdoido',
    avatarGrad: 'linear-gradient(135deg, var(--lime-500), var(--lime-600))',
  },

  workspace: {
    id: 'ws_1',
    name: 'DEVDOIDO',
    initials: 'DD',
    category: 'blog',
    color: 'hsl(217 91% 55%)',
    description: 'Blog sobre programação, IA, SaaS e carreira dev.',
    blogSlug: 'devdoido',
    website: 'https://devdoido.com.br',
    instagram: '@devdoido',
  },

  connection: {
    account: 'devdoido.bot@gmail.com',
    avatarLetter: 'D',
    authorizedAt: '14 abr 2026',
    tokenRenewedAt: '2h',
  },

  stats: {
    channelsCount: 3,
    videosCount: 128,
    runsCount: 42,
    quotaUsed: 32,
    balance: 1240,
    balanceMax: 3000,
    blogArticles: 42,
    publishedArticles: 31,
    draftArticles: 8,
    aiGenerated: 28,
    blogViews: 18400,
    followers: 312,
    videosToday: 6,
  },

  channels: [
    {
      id: 'ch_1',
      name: 'Rocketseat',
      handle: '@rocketseat',
      channelId: 'UCSfwM5u0Kf33Bnzwd9rocket',
      color: 'linear-gradient(135deg,#8257e6,#6420aa)',
      letter: 'R',
      subscribers: 2100000,
      lastVideo: 'capturado hoje 08:00',
      active: true,
    },
    {
      id: 'ch_2',
      name: 'Filipe Deschamps',
      handle: '@FilipeDeschamps',
      channelId: 'UCRWqwD1...',
      color: 'linear-gradient(135deg,#06b6d4,#0e7490)',
      letter: 'F',
      subscribers: 1600000,
      lastVideo: 'capturado hoje 08:00',
      active: true,
    },
    {
      id: 'ch_3',
      name: 'Código Fonte TV',
      handle: '@codigofontetv',
      channelId: 'UClbYj...',
      color: 'linear-gradient(135deg,#f59e0b,#b45309)',
      letter: 'C',
      subscribers: 1200000,
      lastVideo: 'capturado ontem',
      active: false,
    },
  ],

  runs: [
    { when: 'hoje 08:00', date: '29 mai 2026', status: 'ok', chans: 3, news: 6, done: 6, dur: '2:14' },
    { when: 'ontem 08:00', date: '28 mai 2026', status: 'ok', chans: 3, news: 4, done: 4, dur: '1:52' },
    { when: '27 mai 08:00', date: '27 mai 2026', status: 'err', chans: 3, news: 5, done: 3, dur: '3:40' },
    { when: '26 mai 08:00', date: '26 mai 2026', status: 'ok', chans: 3, news: 2, done: 2, dur: '1:08' },
    { when: '25 mai 08:00', date: '25 mai 2026', status: 'ok', chans: 3, news: 3, done: 3, dur: '1:36' },
  ],

  videos: [
    { ch: 'rocketseat', chName: 'Rocketseat', col: '#8257e6,#3b0d6b', letter: 'R', title: 'Next.js 16: o que muda na prática', dur: '18:24', pub: '29 mai', words: '3.412', status: 'done', thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { ch: 'rocketseat', chName: 'Rocketseat', col: '#8257e6,#3b0d6b', letter: 'R', title: 'Como estruturar um monorepo com Turborepo', dur: '24:10', pub: '28 mai', words: '4.108', status: 'done', thumbGrad: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
    { ch: 'filipe', chName: 'Filipe Deschamps', col: '#06b6d4,#0e7490', letter: 'F', title: 'Construindo um sistema de filas do zero', dur: '41:52', pub: '29 mai', words: '7.220', status: 'proc', thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)' },
    { ch: 'codigofonte', chName: 'Código Fonte TV', col: '#f59e0b,#b45309', letter: 'C', title: 'O que é Clean Architecture de verdade', dur: '15:30', pub: '28 mai', words: '2.890', status: 'done', thumbGrad: 'linear-gradient(135deg,#f59e0b,#92400e)' },
    { ch: 'rocketseat', chName: 'Rocketseat', col: '#8257e6,#3b0d6b', letter: 'R', title: 'React Server Components explicado', dur: '21:08', pub: '27 mai', words: '3.940', status: 'done', thumbGrad: 'linear-gradient(135deg,#6d28d9,#4c1d95)' },
    { ch: 'filipe', chName: 'Filipe Deschamps', col: '#06b6d4,#0e7490', letter: 'F', title: 'Postgres: índices que você não usa mas deveria', dur: '33:14', pub: '27 mai', words: '6.012', status: 'done', thumbGrad: 'linear-gradient(135deg,#0891b2,#0c4a6e)' },
    { ch: 'codigofonte', chName: 'Código Fonte TV', col: '#f59e0b,#b45309', letter: 'C', title: 'TypeScript avançado: generics na prática', dur: '19:45', pub: '26 mai', words: '3.510', status: 'queue', thumbGrad: 'linear-gradient(135deg,#d97706,#92400e)' },
    { ch: 'rocketseat', chName: 'Rocketseat', col: '#8257e6,#3b0d6b', letter: 'R', title: 'Deploy na AWS sem quebrar o orçamento', dur: '27:30', pub: '26 mai', words: '4.880', status: 'done', thumbGrad: 'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { ch: 'filipe', chName: 'Filipe Deschamps', col: '#06b6d4,#0e7490', letter: 'F', title: 'Como funciona o event loop do Node.js', dur: '38:02', pub: '25 mai', words: '6.740', status: 'done', thumbGrad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)' },
  ],

  artigos: [
    { title: 'Next.js 16 na prática: o novo cache que finalmente faz sentido', status: 'draft', src: 'ia', cat: 'Next.js', from: 'Rocketseat', updated: 'hoje 08:02', views: 0, grad: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'N', slug: 'nextjs-16-cache', idx: { state: 'na' } },
    { title: 'Como funciona o event loop do Node.js', status: 'draft', src: 'ia', cat: 'Node.js', from: 'Filipe Deschamps', updated: 'hoje 08:01', views: 0, grad: 'linear-gradient(135deg,#06b6d4,#0c4a6e)', letter: 'E', slug: 'event-loop-nodejs', idx: { state: 'na' } },
    { title: 'Se o Cursor cair, você sabe codar?', status: 'published', src: 'manual', cat: 'Carreira', from: 'você', updated: '28 mai', views: 2400, grad: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'C', slug: 'cursor-cair-saber-codar', idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: '27 mai 2026', checked: 'há 3h' } },
    { title: 'Clean Architecture de verdade: o guia sem hype', status: 'published', src: 'ia', cat: 'Arquitetura', from: 'Código Fonte TV', updated: '28 mai', views: 1820, grad: 'linear-gradient(135deg,#f59e0b,#92400e)', letter: 'A', slug: 'clean-architecture-guia', idx: { state: 'notindexed', coverage: 'Descoberta — não indexada no momento', crawl: '—', checked: 'há 3h' } },
    { title: 'MEI, ME ou PJ: o que vale a pena pra dev em 2026', status: 'published', src: 'manual', cat: 'Finanças', from: 'você', updated: '27 mai', views: 980, grad: 'linear-gradient(135deg,#3b82f6,#1e3a8a)', letter: 'M', slug: 'mei-me-pj-dev-2026', idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: '26 mai 2026', checked: 'há 1d' } },
    { title: 'React Server Components explicado de uma vez', status: 'published', src: 'ia', cat: 'React', from: 'Rocketseat', updated: '27 mai', views: 1540, grad: 'linear-gradient(135deg,#6d28d9,#4c1d95)', letter: 'R', slug: 'rsc-explicado', idx: { state: 'indexed', coverage: 'URL enviada e indexada', crawl: '26 mai 2026', checked: 'há 1d' } },
    { title: 'Postgres: índices que você não usa mas deveria', status: 'published', src: 'ia', cat: 'Banco de dados', from: 'Filipe Deschamps', updated: '27 mai', views: 1210, grad: 'linear-gradient(135deg,#0891b2,#0c4a6e)', letter: 'P', slug: 'postgres-indices', idx: { state: 'notindexed', coverage: 'Rastreada — não indexada no momento', crawl: '25 mai 2026', checked: 'há 2d' } },
    { title: 'Como cobrar mais como freelancer sem perder cliente', status: 'published', src: 'manual', cat: 'Finanças', from: 'você', updated: '25 mai', views: 760, grad: 'linear-gradient(135deg,#84cc16,#3f6212)', letter: 'F', slug: 'cobrar-mais-freelancer', idx: { state: 'unknown' } },
    { title: 'TypeScript avançado: generics na prática', status: 'draft', src: 'ia', cat: 'TypeScript', from: 'Código Fonte TV', updated: '24 mai', views: 0, grad: 'linear-gradient(135deg,#d97706,#92400e)', letter: 'T', slug: 'typescript-generics', idx: { state: 'na' } },
    { title: 'Deploy na AWS sem quebrar o orçamento', status: 'archived', src: 'ia', cat: 'DevOps', from: 'Rocketseat', updated: '20 mai', views: 430, grad: 'linear-gradient(135deg,#8257e6,#3b0d6b)', letter: 'D', slug: 'deploy-aws-barato', idx: { state: 'excluded', coverage: "Excluída por tag 'noindex'", crawl: '19 mai 2026', checked: 'há 9d' } },
  ],

  credits: {
    balance: 1240,
    balanceMax: 3000,
    renewIn: 16,
    renewDate: '14 jun 2026',
    plan: 'Pro',
    planPrice: 49,
    cardLast4: '4242',
    consumption: [
      { label: 'Geração de artigos', icon: 'article', count: 28, unitCost: 25, total: 700, color: 'var(--lime-500)' },
      { label: 'Transcrição de vídeos', icon: 'transcribe', count: 96, unitCost: 10, total: 960, color: 'hsl(0 90% 60%)' },
      { label: 'Verificação de indexação', icon: 'search', count: 100, unitCost: 1, total: 100, color: 'hsl(217 85% 60%)' },
    ],
    history: [
      { type: 'expense', action: 'Geração de artigo · "Next.js 16 na prática"', detail: 'automação · de vídeo Rocketseat', date: 'hoje 08:02', amount: -25 },
      { type: 'expense', action: 'Transcrição · 6 vídeos', detail: 'execução diária', date: 'hoje 08:00', amount: -60 },
      { type: 'income', action: 'Recarga via Pix · Abacate Pay', detail: 'pacote 5.000 créditos', date: '27 mai 14:20', amount: 5000 },
      { type: 'expense', action: 'Verificação de indexação · lote', detail: '9 URLs', date: '27 mai 09:15', amount: -9 },
      { type: 'income', action: 'Renovação mensal · plano Pro', detail: 'franquia', date: '14 mai 00:00', amount: 3000 },
    ],
  },

  session: {
    nextRunAt: 'Amanhã, 08:00',
    nextRunRel: '14h 32min',
    timezone: 'America/Sao_Paulo',
    frequency: 'daily',
    cronExpr: '0 8 * * *',
    quotaPerRun: 412,
  },
};

export const STATUS_META: Record<string, { cls: string; label: string }> = {
  done: { cls: 'done', label: 'transcrito' },
  proc: { cls: 'proc', label: 'transcrevendo' },
  queue: { cls: 'queue', label: 'na fila' },
};

export const ART_STATUS_META: Record<string, { cls: string; label: string }> = {
  published: { cls: 'published', label: 'publicado' },
  draft: { cls: 'draft', label: 'rascunho' },
  archived: { cls: 'archived', label: 'arquivado' },
};

export const IDX_META: Record<string, { cls: string; label: string; dot: string }> = {
  indexed: { cls: 'indexed', label: 'Indexada', dot: 'var(--lime-400)' },
  notindexed: { cls: 'notindexed', label: 'Não indexada', dot: 'hsl(0 72% 66%)' },
  excluded: { cls: 'excluded', label: 'Excluída', dot: 'hsl(38 92% 68%)' },
  unknown: { cls: 'unknown', label: 'Verificar', dot: 'var(--fg-dim)' },
  checking: { cls: 'checking', label: 'Verificando', dot: 'hsl(217 85% 72%)' },
  queued: { cls: 'queued', label: 'Na fila', dot: 'var(--fg-muted)' },
};

export const PACKS = [
  { credits: 1000, price: 19, rate: 'R$ 0,019/cr', best: false },
  { credits: 5000, price: 79, rate: 'R$ 0,016/cr', best: true },
  { credits: 15000, price: 199, rate: 'R$ 0,013/cr', best: false },
];

export const PLANS = [
  {
    name: 'Free',
    price: 0,
    credits: 200,
    features: [
      { ok: true, label: '1 SaaS / blog' },
      { ok: true, label: '1 canal monitorado' },
      { ok: true, label: 'Transcrição + geração manual' },
      { ok: false, label: 'Geração automática' },
      { ok: false, label: 'Verificação de indexação' },
      { ok: false, label: 'Marca CrazyStack no rodapé' },
    ],
    buttonLabel: 'seu plano anterior',
    featured: false,
  },
  {
    name: 'Pro',
    priceMonth: 49,
    priceYear: 490,
    credits: 3000,
    features: [
      { ok: true, label: '3 SaaS / blogs' },
      { ok: true, label: '10 canais monitorados' },
      { ok: true, label: 'Geração automática de artigos' },
      { ok: true, label: 'Verificação de indexação (GSC)' },
      { ok: true, label: 'Sem marca CrazyStack' },
      { ok: true, label: 'Recarga avulsa de créditos' },
    ],
    buttonLabel: 'Plano atual',
    featured: true,
  },
  {
    name: 'Scale',
    priceMonth: 149,
    priceYear: 1490,
    credits: 12000,
    features: [
      { ok: true, label: 'SaaS / blogs ilimitados' },
      { ok: true, label: 'Canais ilimitados' },
      { ok: true, label: 'Tudo do Pro +' },
      { ok: true, label: 'Fila de processamento prioritária' },
      { ok: true, label: 'Acesso à API + webhooks' },
      { ok: true, label: 'Suporte dedicado' },
    ],
    buttonLabel: 'Fazer upgrade',
    featured: false,
  },
];
