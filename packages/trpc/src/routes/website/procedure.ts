import type { HttpMethod, MonitorRequestMessage } from '@repo/kafka/types';
import { createTRPCRouter, protectedProcedure } from '../../init';
import { getTopicForInterval } from '@repo/kafka/config';
import { createProducerClient } from '@repo/kafka';
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
      const website = await db
        .select()
        .from(websites)
        .where(and(eq(websites.userId, userId), eq(websites.id, input.id)));
      if (!website) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Website with ${input.id} not found.`,
        });
      }
      return website;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const allWebsites = await db.select().from(websites).where(eq(websites.userId, userId));
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
        httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']).default('GET'),
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
        const existingWebsite = await db
          .select({ id: websites.id })
          .from(websites)
          .where(and(eq(websites.url, url), eq(websites.userId, userId)))
          .limit(1);

        if (existingWebsite.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Website already exists',
          });
        }
        await db.transaction(async (tx) => {
          const [newWebsite] = await tx
            .insert(websites)
            .values({
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
            })
            .returning();
          if (!newWebsite) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to create website',
            });
          }
          const topic = getTopicForInterval(monitoringIntervalSeconds);
          if (!topic) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to get topic',
            });
          }
          const producer = await createProducerClient('website-monitor-producer');
          const message: MonitorRequestMessage = {
            configId: newWebsite.id,
            url: newWebsite.url,
            method: newWebsite.httpMethod as HttpMethod,
            headers: (newWebsite.httpHeaders ?? {}) as Record<string, string>,
            body: newWebsite.requestBody ?? undefined,
            expectedStatusCode: newWebsite.expectedResponseCode,
            intervalSeconds: monitoringIntervalSeconds,
            timeoutMs: timeoutSeconds * 1000,
            scheduledAt: Date.now(),
            attempt: 1,
            maxRetries: 0,
          };
          await producer
            .sendSingle(topic, message, newWebsite.id)
            .catch((err) => console.error('Kafka send failed', err));
          return newWebsite;
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create website',
        });
      }
    }),
});
