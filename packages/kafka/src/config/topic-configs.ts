import { KAFKA_TOPICS, type KafkaTopic } from '../types/kafka';

export interface TopicConfig {
  partitions: number;
  replicationFactor: number;
  retentionMs: number;
  cleanupPolicy: 'delete' | 'compact' | 'compact,delete';
  compressionType?: 'gzip' | 'snappy' | 'lz4' | 'zstd';
  minInSyncReplicas?: number;
}

export const TOPIC_CONFIGS: Record<string, TopicConfig> = {
  [KAFKA_TOPICS.MONITOR_30S]: {
    partitions: 6,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 24 * 60 * 60 * 1000, // 1 day
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.MONITOR_1M]: {
    partitions: 6,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.MONITOR_5M]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },

  // Event topics
  [KAFKA_TOPICS.MONITOR_EXECUTIONS]: {
    partitions: 6,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 24 * 60 * 60 * 1000,
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.MONITOR_FAILURES]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.MONITOR_RECOVERIES]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.ALERTS_V2]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.ALERTS_DLQ]: {
    partitions: 1,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.CONFIG_UPDATES]: {
    partitions: 1, // Ordered processing
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'compact',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.CONFIG_ERRORS]: {
    partitions: 1,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.SYSTEM_HEALTH]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 24 * 60 * 60 * 1000, // 1 day
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.METRICS]: {
    partitions: 6,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 24 * 60 * 60 * 1000, // 1 day
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },

  // Legacy topics
  [KAFKA_TOPICS.ALERTS]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.HEALTH]: {
    partitions: 3,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 24 * 60 * 60 * 1000, // 1 day
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
  [KAFKA_TOPICS.DLQ]: {
    partitions: 1,
    replicationFactor: process.env.NODE_ENV === 'production' ? 3 : 1,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    compressionType: 'gzip',
    minInSyncReplicas: process.env.NODE_ENV === 'production' ? 2 : 1,
  },
};

export const getTopicConfig = (topic: KafkaTopic): TopicConfig => {
  const config = TOPIC_CONFIGS[topic];
  if (!config) {
    throw new Error(`No configuration found for topic: ${topic}`);
  }
  return config;
};

export const getAllTopicConfigs = (): Record<string, TopicConfig> => {
  return { ...TOPIC_CONFIGS };
};

export const getEventTopics = (): KafkaTopic[] => {
  return [
    KAFKA_TOPICS.MONITOR_EXECUTIONS,
    KAFKA_TOPICS.MONITOR_FAILURES,
    KAFKA_TOPICS.MONITOR_RECOVERIES,
    KAFKA_TOPICS.ALERTS_V2,
    KAFKA_TOPICS.ALERTS_DLQ,
    KAFKA_TOPICS.CONFIG_UPDATES,
    KAFKA_TOPICS.CONFIG_ERRORS,
    KAFKA_TOPICS.SYSTEM_HEALTH,
    KAFKA_TOPICS.METRICS,
  ];
};
