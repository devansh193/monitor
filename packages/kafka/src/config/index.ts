import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  KAFKA_CLIENT_ID: z.string().default('uptime-monitor'),
  KAFKA_BROKERS: z.string().transform((s) => s.split(',')),
  KAFKA_USERNAME: z.string().optional(),
  KAFKA_PASSWORD: z.string().optional(),
  KAFKA_SSL: z.boolean().default(false),

  POSTGRES_URL: z.string(),
  TIMESCALE_URL: z.string(),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  WORKER_REGION: z.string().default('us-east-1'),
  WORKER_CONCURRENCY: z.number().default(100),
  WORKER_BATCH_SIZE: z.number().default(10),

  HTTP_TIMEOUT_MS: z.number().default(30000),
  HTTP_MAX_REDIRECTS: z.number().default(5),

  ALERT_COOLDOWN_MS: z.number().default(300000), // 5 minutes
  HEALTH_REPORT_INTERVAL_MS: z.number().default(60000), // 1 minute
});

export type Config = z.infer<typeof configSchema>;

let config: Config;

export const getConfig = (): Config => {
  if (!config) {
    config = configSchema.parse(process.env);
  }
  return config;
};

export { getTopicForInterval, getAllMonitorTopics, KAFKA_CONFIG } from './topics';
