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
| `bun test` | Testes unitários |

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
