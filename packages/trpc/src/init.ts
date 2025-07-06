import { initTRPC, TRPCError } from '@trpc/server';
import { z, ZodError } from 'zod/v4';
import superjson from 'superjson';

import type { Auth } from '@repo/auth/src/index';
import { cache } from 'react';

export const createTRPCContext = cache(async (opts: { headers: Headers; auth: Auth }) => {
  const authApi = opts.auth.api;
  const session = await authApi.getSession({
    headers: opts.headers,
  });
  return {
    authApi,
    session,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError
          ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
          : null,
    },
  }),
});

export const createTRPCRouter = t.router;

/**
 * Timing middleware for tRPC procedures
 *
 * Measures and logs the execution time of each tRPC procedure call.
 * This middleware is applied to both public and protected procedures
 * to provide performance monitoring and debugging capabilities.
 *
 * @param next - The next middleware or procedure in the chain
 * @param path - The tRPC procedure path being executed
 * @returns The result of the procedure execution
 *
 * @example
 * // Applied automatically to all procedures:
 * export const publicProcedure = t.procedure.use(timingMiddleware);
 * export const protectedProcedure = t.procedure.use(isAuthenticated).use(timingMiddleware);
 *
 * // Logs: [TRPC] user.getProfile took 45ms to execute
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated).use(timingMiddleware);
