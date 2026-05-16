# DEVDOIDO

Monorepo Bun com API Elysia demo e site Astro para `devdoido.com.br`.

## Stack

- Bun para runtime e package manager
- Astro para site estatico
- Elysia para API demo
- Tailwind e CSS proprio para estilos

## Estrutura

```txt
apps/
  api/       API Elysia demo
  landing/   site DEVDOIDO
```

## Desenvolvimento

```bash
bun install
bun run dev
```

URLs locais:

- Site: http://localhost:4321
- API: http://localhost:3000

## Scripts

| Script | Descricao |
| --- | --- |
| `bun run dev` | API + site |
| `bun run dev:api` | API |
| `bun run dev:landing` | Site Astro |
| `bun run build` | Build API + site |
| `bun run build:landing` | Build do site |
| `bun run check` | Testes + build |
| `bun run test` | Testes da API |
| `bun run lint` | ESLint |

## Site

Rotas principais:

- `/`
- `/blog`
- `/blog/pare-de-aprender-framework`
- `/categoria/vibe-coding`
- `/sobre`
- `/newsletter`
- `/cursos/crazystack-typescript`
- `/admin/transcribe`

O admin atual e mock visual estatico. Nao existe backend real de transcricao nesta versao.
