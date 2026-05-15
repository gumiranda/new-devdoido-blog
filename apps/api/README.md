# API (Elysia)

Demo backend for BETA Stack. Used by the landing app via **Eden Treaty** for type-safe API calls.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info (`name`, `version`) |
| GET | `/health` | Health check (`{ ok: true }`) for load balancers / monitoring |
| POST | `/auth/login` | Demo login — accepts any username/password, returns a fake user (Eden Treaty demo) |
| GET | `/auth/me` | Demo — returns a message (no real auth) |

This is a **demo**: there is no real authentication. Login accepts any credentials and returns a typed user object so the frontend can show Eden Treaty type-sharing.

## Eden Treaty

The landing app imports `type App` from this package and uses `treaty<App>(url)` so every route and response is typed. See `apps/landing/src/lib/eden.ts`.

## Env

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `3000`) |

## Run

```bash
bun run dev    # from apps/api
# or from repo root:
bun run dev:api
```
