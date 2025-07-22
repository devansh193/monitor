import { z } from 'zod';

const zBool = z
  .string()
  .transform((val) => val === 'true')
  .or(z.boolean());

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  KAFKA_CLIENT_ID: z.string().default('uptime-monitor'),
  KAFKA_BROKERS: z
    .string()
    .transform((s) => s.split(',').map((b) => b.trim()))
    .pipe(z.array(z.string()).min(1, { message: 'At least one broker is required' })),

  KAFKA_USERNAME: z.string().optional().nullable(),
  KAFKA_PASSWORD: z.string().optional().nullable(),
  KAFKA_SSL: zBool.default(false),

  HTTP_TIMEOUT_MS: z.coerce.number().default(30000),
  HTTP_MAX_REDIRECTS: z.coerce.number().default(5),

  ALERT_COOLDOWN_MS: z.coerce.number().default(300000),
  HEALTH_REPORT_INTERVAL_MS: z.coerce.number().default(60000),
});

export type Config = z.infer<typeof configSchema>;

let config: Config;

export const getConfig = (): Config => {
  if (!config) {
    config = configSchema.parse(process.env);
  }
  return config;
};

// export { getTopicForInterval, getAllMonitorTopics, KAFKA_CONFIG } from './topics';
export {
  TOPIC_CONFIGS,
  getTopicConfig,
  getAllTopicConfigs,
  getEventTopics,
  type TopicConfig,
} from './topic-configs';
