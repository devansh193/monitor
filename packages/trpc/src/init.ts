import { initTRPC, TRPCError } from '@trpc/server';
import { z, ZodError } from 'zod/v4';
import superjson from 'superjson';

// import { isAuthenticated } from './middlewares/require_authenticated_user';
import { timingMiddleware } from './middlewares/timing_middleware';
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
    headers: opts.headers,
  };
});

export const t = initTRPC.context<typeof createTRPCContext>().create({
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

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
