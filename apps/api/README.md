# API (Elysia + Drizzle + Better Auth)

Backend multi-tenant do CrazyStack/DEVDOIDO Pipeline. Consumido pela landing via **Eden Treaty** (`type App`).

- **Runtime:** Bun · **Framework:** Elysia
- **DB:** Neon Postgres via `drizzle-orm/neon-serverless` (Pool/WebSocket → transações)
- **Auth:** Better Auth (email/senha) + organization plugin → `organization` == workspace

## Setup

```bash
cp .env.example .env        # preencha DATABASE_URL (Neon) e BETTER_AUTH_SECRET
bun install
bun run db:migrate          # aplica drizzle/ no banco
bun run db:seed             # popula dados de exemplo (porta o MOCK)
bun run dev                 # http://localhost:3000
```

> ⚠️ Os scripts `db:*` rodam o drizzle-kit **via Node** (`node ./node_modules/.bin/drizzle-kit ...`).
> O drizzle-kit detecta `process.stdin.isTTY` como `false` sob Bun e aborta com erro de TTY; o Node trata corretamente.

## Scripts

| Script | Descrição |
|--------|-----------|
| `bun run dev` | Servidor com hot reload |
| `bun run db:generate` | Gera SQL de migration a partir de `src/db/schema.ts` |
| `bun run db:migrate` | Aplica migrations no banco |
| `bun run db:push` | Empurra o schema direto (dev) |
| `bun run db:seed` | Popula dados de exemplo |
| `bun run db:studio` | Drizzle Studio |
| `bun test` | Roda **todos** os testes (unit + e2e) com cobertura |

## Testes

`bun test` roda **toda** a suíte. Funciona tanto da **raiz do monorepo** quanto de `apps/api`
(o `bunfig.toml` da raiz e do pacote dão preload no `apps/api/.env`, então `DATABASE_URL` etc.
carregam em qualquer cwd). O timeout já vem generoso embutido (30s) — não precisa passar `--timeout`.

```bash
bun test                              # tudo (unit + e2e); rodando em apps/api inclui cobertura
bun test src/unit.test.ts             # só os testes de unidade (puros, sem DB)
bun test src/e2e.test.ts              # só a e2e (precisa de DATABASE_URL)
bun test -t "billing"                 # filtra por nome do teste/describe
```

**Pré-requisito da e2e:** ela dirige o app real (`app.handle()`) contra o **banco Neon de verdade**
(`DATABASE_URL` do `.env`) e exige que o schema esteja sincronizado — rode `bun run db:push` antes
se o banco estiver atrás do `src/db/schema.ts`. Cada execução cria usuários/orgs isolados e os apaga
no `afterAll`, então não suja dados existentes. As integrações externas (Google, Gladia, Stripe,
AbacatePay, GSC, S3, Claude/OpenAI) são exercitadas com `fetch` mockado + variáveis de ambiente
alternadas em runtime — nenhuma chamada externa real é feita.

Arquivos:

| Arquivo | O que cobre |
|---------|-------------|
| `src/unit.test.ts` | libs puras: `env`, `cors`, `encryption`, `prompts`, `logger`, `validation`, `cron`, `rate-limit` |
| `src/e2e.test.ts`  | HTTP ponta-a-ponta de todos os módulos + guard + CORS + webhooks + pipeline + primitivas de crédito |
| `src/index.test.ts`| smoke do app (health, sitemap, robots, feed público) |

Cobertura: **100% das linhas** em todo `src/` (o número de *funções* em `db/schema.ts` é só dos
builders de tabela do drizzle, não há lógica executável ali).

## Estrutura

```
src/
  index.ts            # bootstrap: CORS + /api/auth/* + módulos, export type App
  env.ts              # env (DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGIN, ...)
  db/{client,schema,seed}.ts
  auth/{auth,guard}.ts
  lib/{cors,slug,plans}.ts
  modules/            # overview, channels, videos, runs, articles, tags,
                      # automation, schedule, wallet, billing, workspace
```

## Auth

- `/api/auth/*` → Better Auth (sign-up/in, sessão, organization plugin: criar/listar/trocar workspace).
- Cada módulo usa `authGuard` (`src/auth/guard.ts`): exige sessão (401), resolve o workspace ativo
  (`session.activeOrganizationId` ou 1ª membership) e injeta `{ userId, workspaceId, user }`.

## Domínio (rotas, todas escopadas por workspace)

`/overview` · `/channels` · `/videos` · `/runs` · `/articles` (+ `/:id/tags`, `/:id/moderate`,
`?tag=`, `?moderationStatus=`) · `/tags` · `/automation` · `/schedule` · `/wallet` ·
`/billing/checkout` · `/workspace`.

### Créditos atômicos

`debitCredit()` / `creditWallet()` (`src/db/client.ts`) usam `db.transaction` + `SELECT ... FOR UPDATE`
no `wallet` → débito + log na mesma transação (sem overselling concorrente).

## STUBS / TODO (não implementados nesta fase)

YouTube Data API · transcrição · geração IA (Claude) · moderação OpenAI · Stripe · Abacate Pay ·
refresh de token OAuth Google (`google_connection.tokenExpiresAt` existe; renovação é manual por ora).
