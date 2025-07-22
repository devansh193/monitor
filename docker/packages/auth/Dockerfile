# Stage 1:base
FROM oven/bun:slim AS base

COPY bun.lock package.json turbo.json ./
COPY packages/auth/package.json packages/auth/package.json

RUN bun install --frozen-lockfile
# Stage 2:builder
FROM oven/bun:latest AS builder
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/bun.lock ./bun.lock

COPY . .

WORKDIR /app/packages/auth
RUN bun run build
# Stage 3:runner
FROM oven/bun:latest AS runner
WORKDIR /app

COPY --from=builder /app/packages/auth/dist ./dist
COPY --from=builder /app/packages/auth/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

RUN bun install --production --frozen-lockfile

EXPOSE 4001

CMD ["bun", "run", "start"]