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

import { t } from '../init';

export const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  return result;
});
