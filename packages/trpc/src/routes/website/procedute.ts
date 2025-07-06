import { createTRPCRouter, protectedProcedure } from '../../init';
import { websites } from '@repo/store/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import db from '@repo/store/client';
import z from 'zod';

export const websiteRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const existingWebsite = await db
        .select()
        .from(websites)
        .where(and(eq(websites.userId, userId), eq(websites.id, input.id)));
      if (!existingWebsite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Website with ${input.id} not found.`,
        });
      }
      return existingWebsite;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const allWebsites = await db.select().from(websites).where(eq(websites.userId, userId));
    if (!allWebsites || allWebsites.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No website with usedId:${ctx.session.user.id} found.`,
      });
    }
    return allWebsites;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        url: z.string().url().max(2048),
        monitoringIntervalSeconds: z
          .enum(['5', '10', '15', '30', '60', '120', '180', '300', '600', '900'])
          .transform((val) => parseInt(val)),
        httpMethod: z
          .enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
          .default('GET'),
        httpHeader: z.record(z.string()).optional(),
        requestBody: z.string().optional(),
        expectedResponseCode: z.number().min(100).max(599).default(200),
        expectedResponseBody: z.string().max(500).optional(),
        timeoutSeconds: z.number().min(1).positive().max(300).default(10),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          name,
          url,
          monitoringIntervalSeconds,
          httpMethod,
          httpHeader,
          requestBody,
          expectedResponseCode,
          expectedResponseBody,
          timeoutSeconds,
          isActive,
        } = input;
        const { session } = ctx;

        if (!session?.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
        }
        const userId = session.user.id;
        const existingWebsite = await db.select().from(websites).where(eq(websites.url, url));
        if (existingWebsite.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Website already exists',
          });
        }
        const newWebsite = await db.insert(websites).values({
          userId,
          name,
          url,
          monitoringIntervalSeconds,
          httpMethod,
          httpHeaders: httpHeader,
          requestBody,
          timeoutSeconds,
          isActive,
          expectedResponseCode,
          expectedResponseBody,
        });
        return newWebsite;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create website',
        });
      }
    }),
});
