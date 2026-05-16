export const SITE = {
  name: 'DEVDOIDO',
  title: 'DEVDOIDO',
  url: 'https://devdoido.com.br',
  description:
    'Conteudo bruto sobre programacao, IA, vibe coding, SaaS e carreira dev. Sem hype, sem promessa facil, sem rodeio.',
  author: '@devdoido',
};

export type Badge = {
  label: string;
  solid?: boolean;
  sale?: boolean;
  accent?: boolean;
};

export type Post = {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  pubDate: string;
  reads: string;
  minutes: number;
  kind: 'grid' | 'mono';
  display: string;
  tags: string[];
  badges?: Badge[];
  featured?: boolean;
  pinned?: boolean;
};

export const categories = [
  { name: 'Vibe Coding', slug: 'vibe-coding', count: 48 },
  { name: 'IA & Agents', slug: 'ia', count: 91 },
  { name: 'Micro-SaaS', slug: 'saas', count: 62 },
  { name: 'Carreira', slug: 'carreira', count: 37 },
  { name: 'Next.js', slug: 'next', count: 29 },
  { name: 'React Native', slug: 'react-native', count: 18 },
  { name: 'Bun & Node', slug: 'bun-node', count: 22 },
  { name: 'Conteudo', slug: 'conteudo', count: 14 },
];

export const posts: Post[] = [
  {
    slug: 'pare-de-aprender-framework',
    category: 'Vibe Coding',
    categorySlug: 'vibe-coding',
    title: 'Pare de aprender framework. Aprenda a pensar.',
    description:
      'Voce nao precisa de mais um curso de Next.js. Voce precisa parar de tratar IDE como tutorial e codigo como cargo.',
    pubDate: '2026-05-15',
    reads: '12.8k',
    minutes: 8,
    kind: 'grid',
    display: 'MANIFESTO',
    tags: ['vibe-coding', 'claude-code', 'cursor', 'carreira', 'manifesto'],
    badges: [{ label: 'manifesto', solid: true }],
    featured: true,
    pinned: true,
  },
  {
    slug: 'claude-code-ficou-caro',
    category: 'Vibe Coding',
    categorySlug: 'vibe-coding',
    title: 'Claude Code ficou caro. Cursor virou refem. E agora?',
    description: 'A conta chegou para quem terceirizou pensamento para autocomplete e chamou isso de workflow.',
    pubDate: '2026-05-12',
    reads: '8.4k',
    minutes: 8,
    kind: 'mono',
    display: 'A IDE MORREU',
    tags: ['vibe-coding', 'claude-code', 'cursor'],
    badges: [{ label: '#1', solid: true }],
    pinned: true,
  },
  {
    slug: 'seis-prompts-quatro-devs',
    category: 'IA',
    categorySlug: 'ia',
    title: 'Os 6 prompts que substituiram meu time de 4 devs',
    description: 'Nao foi magica. Foi escopo pequeno, contexto bom e revisao sem piedade antes de mandar para prod.',
    pubDate: '2026-05-11',
    reads: '6.1k',
    minutes: 12,
    kind: 'grid',
    display: '6 PROMPTS',
    tags: ['ia', 'agents', 'prompts'],
    badges: [{ label: '#2', solid: true }],
    pinned: true,
  },
  {
    slug: 'micro-saas-armadilha',
    category: 'SaaS',
    categorySlug: 'saas',
    title: 'Por que SaaS e micro-SaaS sao a maior armadilha pra devs',
    description: 'O pitch e simples. O suporte, boleto, churn e imposto chegam depois.',
    pubDate: '2026-05-10',
    reads: '5.3k',
    minutes: 6,
    kind: 'grid',
    display: 'ARMADILHA',
    tags: ['saas', 'micro-saas', 'negocio'],
    badges: [{ label: '#3', solid: true }],
  },
  {
    slug: 'antigravity-novo-cursor',
    category: 'IA',
    categorySlug: 'ia',
    title: 'Antigravity virou o novo Cursor',
    description: 'Toda ferramenta vira revolucao por 14 dias. Depois vira boleto, extensao quebrada e thread defensiva.',
    pubDate: '2026-05-14',
    reads: '2.1k',
    minutes: 5,
    kind: 'grid',
    display: 'ANTI-GRAV',
    tags: ['ia', 'tools'],
    badges: [{ label: 'new' }],
  },
  {
    slug: 'sandbox-method',
    category: 'Vibe Coding',
    categorySlug: 'vibe-coding',
    title: 'A sandbox method: 90% faster, 0% pensar',
    description: 'Como usar agente em ambiente isolado sem deixar ele redesenhar sua arquitetura inteira.',
    pubDate: '2026-05-13',
    reads: '1.8k',
    minutes: 7,
    kind: 'mono',
    display: 'SANDBOX',
    tags: ['vibe-coding', 'agents'],
  },
  {
    slug: 'dez-k-dev-solo',
    category: 'SaaS',
    categorySlug: 'saas',
    title: 'Como cobrar R$ 10k/mes sendo dev solo em 2026',
    description: 'Produto nao e tela bonita. E dor cara, dono com pressa e contrato sem vergonha de cobrar.',
    pubDate: '2026-05-12',
    reads: '3.2k',
    minutes: 9,
    kind: 'grid',
    display: '10K SOLO',
    tags: ['saas', 'freela', 'carreira'],
    badges: [{ label: 'long read' }],
  },
  {
    slug: 'salario-dev-br-caiu',
    category: 'Carreira',
    categorySlug: 'carreira',
    title: 'Salario dev BR caiu 18%: culpa da IA ou do excel?',
    description: 'Mercado ajustou expectativa, junior virou commodity e senior que entrega segue sem tempo para LinkedIn.',
    pubDate: '2026-05-11',
    reads: '4.5k',
    minutes: 4,
    kind: 'mono',
    display: '-18%',
    tags: ['carreira', 'mercado'],
  },
  {
    slug: 'model-wars-producao',
    category: 'IA',
    categorySlug: 'ia',
    title: 'Claude vs GPT-5 vs Gemini 3: testei em producao',
    description: 'Bench bonito nao paga incidente. Testei nos fluxos que quebram de verdade.',
    pubDate: '2026-05-10',
    reads: '2.8k',
    minutes: 6,
    kind: 'grid',
    display: 'MODEL WARS',
    tags: ['ia', 'models'],
  },
  {
    slug: 'debug-vibe-coded',
    category: 'Vibe Coding',
    categorySlug: 'vibe-coding',
    title: 'Como debugar um app vibe-coded sem chorar',
    description: 'Primeiro pare de pedir outra feature. Depois leia o erro. Revolucionario.',
    pubDate: '2026-05-09',
    reads: '1.6k',
    minutes: 11,
    kind: 'mono',
    display: 'DEBUG/DIE',
    tags: ['vibe-coding', 'debug'],
  },
  {
    slug: 'next-16-server-actions',
    category: 'Next.js',
    categorySlug: 'next',
    title: 'Next 16 chegou: server actions finalmente prestam',
    description: 'Ainda da para usar errado. So ficou mais dificil culpar framework por bagunca local.',
    pubDate: '2026-05-08',
    reads: '2.0k',
    minutes: 3,
    kind: 'grid',
    display: 'NEXT 16',
    tags: ['next', 'react'],
    badges: [{ label: 'hot', sale: true }],
  },
  {
    slug: 'vendo-desconforto',
    category: 'SaaS',
    categorySlug: 'saas',
    title: 'Eu nao vendo curso. Eu vendo desconforto.',
    description: 'Conteudo bom nao te deixa animado. Te deixa sem desculpa.',
    pubDate: '2026-05-07',
    reads: '3.9k',
    minutes: 8,
    kind: 'mono',
    display: 'DESCONFORTO',
    tags: ['conteudo', 'saas'],
  },
];

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];

export const subTags = [
  ['claude code', 14],
  ['cursor', 12],
  ['lovable', 7],
  ['antigravity', 5],
  ['windsurf', 4],
  ['v0', 3],
  ['bolt', 2],
  ['replit agent', 4],
  ['prompts', 18],
  ['agents', 9],
  ['mcp', 6],
] as const;

export const newsletterEditions = [
  ['#141', '08.MAY.2026', 'Por que eu desinstalei o Cursor e voltei pro Zed', '11.2k abriram'],
  ['#140', '01.MAY.2026', 'O dia que eu deletei 14 cursos da minha biblioteca', '9.8k abriram'],
  ['#139', '24.APR.2026', 'Antigravity em prod: 30 dias depois', '10.1k abriram'],
  ['#138', '17.APR.2026', 'IA nao escreveu seu PR. Voce tambem nao.', '12.4k abriram'],
  ['#137', '10.APR.2026', 'Salario dev BR: 5 dados que ninguem mostra', '13.7k abriram'],
] as const;

export const courseModules = [
  ['01', 'Setup & filosofia', '1h 12m', 'Stack, ferramentas, mindset. Por que nao usar Webpack em 2026.'],
  ['02', 'Bun + TypeScript do jeito certo', '1h 38m', 'Bun como runtime, package manager e test runner.'],
  ['03', 'Next 16 sem o que nao importa', '1h 51m', 'Server Components, Server Actions e o que ignorar sem culpa.'],
  ['04', 'Convex: o backend que ninguem te contou', '1h 24m', 'Real-time, reactive, type-safe. Menos cola, mais produto.'],
  ['05', 'Claude Code workflow profissional', '1h 48m', 'Skills, slash commands, MCP servers e revisao como rotina.'],
  ['06', 'n8n + Claude API: pipeline de IA real', '1h 36m', 'Workflows que rodam 24/7 com erro handling, retry e custos.'],
  ['07', 'Build #1: WhatsApp Bot SaaS', '2h 04m', 'Schema, fila, multi-tenant, dashboard e deploy.'],
  ['08', 'Build #2: AI Content Engine', '1h 28m', 'Pesquisa, escrita e publicacao com guardrails.'],
  ['09', 'Build #3: Dev Tools Marketplace', '1h 32m', 'Stripe, auth, checkout e painel pronto pra vender.'],
  ['10', 'Deploy + monitoramento + custos', '0h 47m', 'Coolify, Vercel, Sentry e quanto custa manter tudo vivo.'],
] as const;

export const transcriptSegments = [
  ['00:00', 'E ai galera, bem-vindos a mais um video aqui no canal. Hoje a gente vai falar de uma coisa que me incomoda muito no mundo dev.'],
  ['00:08', 'Vibe coding. Esse termo virou febre, e como toda febre, tem gente usando sem entender o que ta fazendo.'],
  ['00:18', 'A ideia original era simples: usar IA pra codar como quem conversa, sem ficar lendo todo o codigo.'],
  ['00:31', 'Ai cada criador, cada curso barato, cada thread pegou esse termo e fez virar a proxima coisa.'],
  ['00:44', 'O problema: vibe coding nao e pra todo mundo. Nao e pra quem ta comecando.'],
  ['00:52', 'Se voce nao sabe debugar um useEffect, nao vai debugar feature que a IA escreveu inteira.'],
  ['01:08', 'Tem quatro niveis de quem usa IA pra programar. Nivel um: turista. Copia, cola, reza.'],
  ['01:20', 'Nivel dois: apprentice. Le o que a IA escreveu, edita duas linhas, segue. Nivel tres: operator.'],
  ['01:38', 'Nivel quatro: arquiteto. Usa IA pra acelerar o que ja sabia fazer sozinho.'],
  ['01:52', 'A maioria dos cursos vende nivel quatro e entrega nivel um.'],
  ['02:04', 'A pergunta certa nao e qual ferramenta de IA usar. E em qual nivel eu estou.'],
  ['02:16', 'Se voce responder nao para duas perguntas basicas, voce nao ta programando.'],
  ['02:24', 'Voce ta fazendo prompt engineering com extra steps. Vamos no proximo bloco.'],
] as const;

export function formatDate(value: string) {
  return new Date(`${value}T12:00:00-03:00`).toLocaleDateString('pt-BR', { dateStyle: 'long' });
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
