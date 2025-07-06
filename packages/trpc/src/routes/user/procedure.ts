import { createTRPCRouter, protectedProcedure } from '../../init';
import z from 'zod';

export const helloWorld = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const message = input.message;
      console.log(message);
      return {
        message: `Server received: ${message}`,
        timestamp: new Date().toISOString(),
      };
    }),
});
