# Stage 1:base
FROM oven/bun:latest AS base
WORKDIR  /app

COPY bun.lock package.json turbo.json ./
COPY apps/web/package.json apps/web/package.json

RUN bun install --frozen-lockfile

# Stage 2:builder
FROM oven/bun:latest AS builder
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/bun.lockb ./bun.lock


COPY . .

WORKDIR /app/apps/web
RUN bun run build

# Stage 3:runner
FROM  oven/bun:latest AS runner
WORKDIR /app

COPY --from=builder /app/bun.lock ./bun.lock

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

RUN bun install --production --frozen-lockfile

EXPOSE 3000

CMD ["bun", "run", "start"]