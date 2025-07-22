From oven/bun:1.1.27-slim as base

WORKDIR /app

COPY . .

RUN bun install

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]