# Build context must be repo root (see fly.toml).
FROM oven/bun:1 AS builder
WORKDIR /repo

COPY package.json bun.lock ./
COPY tsconfig.json ./
# Full workspace manifests: lockfile was generated with apps/*; omitting landing forces lockfile drift.
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY apps/landing/package.json ./apps/landing/
COPY apps/api/src ./apps/api/src/

RUN bun install --frozen-lockfile

WORKDIR /repo/apps/api
RUN bun build src/index.ts --outdir=dist --target=bun

FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080

COPY --from=builder /repo/apps/api/dist/index.js ./index.js

EXPOSE 8080

CMD ["bun", "run", "./index.js"]
