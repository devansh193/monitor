// Client exports
export {
  KafkaClient,
  ConnectionManager,
  AdminClient,
  TopicManager,
  ProducerClient,
  MessageSender,
  ConsumerClient,
  MessageHandlerFactory,
  createKafkaClient,
  createAdminClient,
  createProducerClient,
  createConsumerClient,
  disconnectAllClients,
  getKafkaClient,
} from './client';

export type { MessageHandler } from './client';

// Configuration exports
export { getConfig } from './config';
export type { Config } from './config';
export { getTopicForInterval, getAllMonitorTopics, KAFKA_CONFIG } from './config/topics';

// Type exports
export type {
  HttpMethod,
  MonitorStatus,
  UptimeStatus,
  AlertSeverity,
  MonitoringConfig,
  MonitorRequestMessage,
  MonitorResult,
  AlertMessage,
  HealthMetrics,
  SupportedInterval,
  KafkaTopic,
} from './types';

export { SUPPORTED_INTERVALS, KAFKA_TOPICS } from './types';

// Utility exports
export { createAppLogger } from './utils';
export type { LogContext } from './utils';
