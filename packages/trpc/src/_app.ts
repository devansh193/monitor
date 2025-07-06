import { websiteRouter } from './routes/website/procedute';
import { createTRPCRouter } from './init';

export const appRouter = createTRPCRouter({
  website: websiteRouter,
});

export type AppRouter = typeof appRouter;
