# API (Elysia + Drizzle + Neon + Better Auth)

Backend real para o DEVDOIDO Pipeline. Usado pelo landing app via **Eden Treaty** para chamadas type-safe.

## Stack

- **Runtime**: Bun
- **Web framework**: Elysia
- **Database**: Neon Postgres (serverless)
- **ORM**: Drizzle ORM (`drizzle-orm/neon-serverless`)
- **Auth**: Better Auth (email/senha + organization plugin)
- **Types**: Eden Treaty (`export type App`)

## Setup

```bash
# 1. Instalar dependências
cd apps/api
bun install

# 2. Copiar .env.example → .env e preencher
cp .env.example .env
# Preencha: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, CORS_ORIGIN

# 3. Gerar migration (já existe em drizzle/)
bun run db:generate

# 4. Executar migration contra Neon
bun run db:migrate

# 5. Popular banco com dados de desenvolvimento
bun run db:seed

# 6. Rodar servidor de dev
bun run dev
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Servidor dev com hot reload |
| `bun run db:generate` | Gera migration SQL a partir do schema (`drizzle-kit generate`) |
| `bun run db:migrate` | Executa migration no banco Neon (`drizzle-kit migrate`) |
| `bun run db:push` | Sincroniza schema direto no banco (dev apenas) |
| `bun run db:seed` | Popula banco com dados mock (popula DB com canais, vídeos, etc.) |
| `bun run db:studio` | Abre Drizzle Studio para explorar o banco |
| `bun run auth:generate` | Gera schema de tabelas do Better Auth |

## Env

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Chave secreta do Better Auth (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | URL pública da API (`http://localhost:3000`) |
| `CORS_ORIGIN` | Origins permitidos para CORS (`http://localhost:4321`) |
| `PORT` | Porta do servidor (default: `3000`) |
| `HOST` | Host (default: `0.0.0.0`) |

## Estrutura

```
src/
├── index.ts              # bootstrap: CORS + auth + 11 módulos + export type App
├── env.ts
├── db/
│   ├── client.ts         # Pool(neon) + drizzle({ schema }) + debitCredit atômico
│   ├── schema.ts         # 21 tabelas (6 Better Auth + 15 domínio)
│   └── seed.ts           # Dados de desenvolvimento
├── auth/
│   ├── auth.ts           # betterAuth({ drizzleAdapter, organization, emailAndPassword })
│   └── guard.ts          # derive: exige sessão → userId + workspaceId
├── modules/              # 11 módulos Elysia (REST tipado)
│   ├── overview.ts       # GET /overview
│   ├── channels.ts       # CRUD /channels
│   ├── videos.ts         # GET /videos
│   ├── runs.ts           # GET /runs
│   ├── articles.ts       # CRUD /articles
│   ├── tags.ts           # GET/POST /tags
│   ├── automation.ts     # /automation
│   ├── schedule.ts       # /schedule
│   ├── wallet.ts         # GET /wallet
│   ├── billing.ts        # /billing
│   └── workspace.ts      # /workspace
└── lib/
    └── validation.ts     # slugify + Elysia schemas
```

## Eden Treaty

O landing app importa `type App` deste pacote e usa `treaty<App>(url)` para chamadas type-safe. Ver `apps/landing/src/lib/eden.ts`.

## Rotas

| Method | Path | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | Não | Health check |
| ALL | `/api/auth/*` | Não | Better Auth (sign-in, sign-up, etc.) |
| GET | `/overview` | Sim | Stats agregadas (canais, vídeos, runs) |
| GET | `/channels` | Sim | Listar canais do workspace |
| POST | `/channels` | Sim | Adicionar canal |
| PATCH | `/channels/:id` | Sim | Atualizar canal (toggle active) |
| GET | `/videos` | Sim | Listar vídeos |
| GET | `/videos/:id/transcript` | Sim | Transcrição do vídeo |
| GET | `/runs` | Sim | Histórico de execuções |
| POST | `/runs/trigger` | Sim | Disparar execução (stub) |
| GET | `/articles` | Sim | Listar artigos |
| POST | `/articles` | Sim | Criar artigo |
| PATCH | `/articles/:id` | Sim | Atualizar artigo |
| GET | `/articles/slug-available` | Sim | Verificar disponibilidade de slug |
| POST | `/articles/:id/moderate` | Sim | Moderar artigo (stub) |
| GET/POST | `/tags` | Sim | Listar/criar tags |
| GET/PUT | `/automation` | Sim | Config de automação |
| POST | `/automation/test` | Sim | Testar geração de artigo (stub) |
| GET/PUT | `/schedule` | Sim | Config de agendamento |
| GET | `/wallet` | Sim | Saldo + consumo + histórico |
| GET | `/billing/packs` | Sim | Pacotes de recarga |
| POST | `/billing/checkout` | Sim | Criar checkout (stub) |
| POST | `/billing/checkout/:id/confirm` | Sim | Confirmar pagamento |
| GET/PUT | `/workspace` | Sim | Config do blog/SaaS |
