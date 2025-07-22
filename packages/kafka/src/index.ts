export {
  KafkaClient,
  ConnectionManager,
  AdminClient,
  TopicManager,
  ProducerClient,
  createKafkaClient,
  createAdminClient,
  disconnectAllClients,
  getKafkaClient,
} from './client';

// Configuration exports
export { getConfig } from './config';
export type { Config } from './config';
export {
  TOPIC_CONFIGS,
  getTopicConfig,
  getAllTopicConfigs,
  getEventTopics,
  type TopicConfig,
} from './config/topic-configs';

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
  MonitorExecutionEvent,
  AlertEvent,
  ConfigUpdateEvent,
  ConfigErrorEvent,
  SystemHealthEvent,
  MetricsEvent,
  KafkaEvent,
  EventType,
  SupportedInterval,
  KafkaTopic,
} from './types';

export { SUPPORTED_INTERVALS, KAFKA_TOPICS } from './types';

// Utility exports
export { createAppLogger } from './utils';
export type { LogContext } from './utils';
