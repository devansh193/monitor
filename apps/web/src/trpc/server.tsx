import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { appRouter, createTRPCContext } from '@repo/trpc';
import type { AppRouter } from '@repo/trpc/index';
import { headers } from 'next/headers';
import { cache } from 'react';

import { createQueryClient } from './query-client';
import auth from '~/auth/server';

/*
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
    auth,
  });
});

export const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createContext);
