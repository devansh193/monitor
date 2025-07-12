import { websiteRouter } from './routes/website/procedure';
import { createTRPCRouter } from './init';

export const appRouter = createTRPCRouter({
  website: websiteRouter,
});

export type AppRouter = typeof appRouter;
