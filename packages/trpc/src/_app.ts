import { websiteRouter } from './routes/monitors/procedure';
import { helloWorld } from './routes/user/procedure';
import { createTRPCRouter } from './init';

export const appRouter = createTRPCRouter({
  hello: helloWorld,
  website: websiteRouter,
});

export type AppRouter = typeof appRouter;
