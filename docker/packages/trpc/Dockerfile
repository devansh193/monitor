# Stage 1:Base
FROM oven/bun:slim AS base
WORKDIR /app

COPY bun.lock package.json ./
COPY packages/trpc/package.json packages/trpc/package.json

RUN bun install --frozen-lockfile

# Stage 2:builder
FROM oven/bun:slim AS builder
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/bun.lock ./bun.lock
COPY . .

WORKDIR /app/packages/auth
RUN bun run build

FROM oven/bun:slim AS runner
WORKDIR /app

COPY --from=runner /app/packages/trpc/dist ./dist
COPY --from=runner /app/packages/trpc/package.json ./package.json
COPY --from=runner /app/bun.lock ./bun.lock

RUN bun install --production --frozen-lockfile

EXPOSE 4042

CMD [ "bun","run", "start"]