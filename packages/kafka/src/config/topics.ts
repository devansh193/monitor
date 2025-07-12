import {
  KAFKA_TOPICS,
  SUPPORTED_INTERVALS,
  type SupportedInterval,
  type KafkaTopic,
} from '../types/kafka';

export const getTopicForInterval = (intervalSeconds: number): KafkaTopic | null => {
  const topicMap: Record<SupportedInterval, KafkaTopic> = {
    5: KAFKA_TOPICS.MONITOR_5S,
    10: KAFKA_TOPICS.MONITOR_10S,
    15: KAFKA_TOPICS.MONITOR_15S,
    30: KAFKA_TOPICS.MONITOR_30S,
    60: KAFKA_TOPICS.MONITOR_1M,
    120: KAFKA_TOPICS.MONITOR_2M,
    300: KAFKA_TOPICS.MONITOR_5M,
    600: KAFKA_TOPICS.MONITOR_10M,
    1800: KAFKA_TOPICS.MONITOR_30M,
    3600: KAFKA_TOPICS.MONITOR_1H,
  };

  return topicMap[intervalSeconds as SupportedInterval] || null;
};

export const getAllMonitorTopics = (): KafkaTopic[] =>
  SUPPORTED_INTERVALS.map((interval) => getTopicForInterval(interval)!);

export const KAFKA_CONFIG = {
  PARTITIONS_PER_TOPIC: 3,
  REPLICATION_FACTOR: process.env.NODE_ENV === 'production' ? 3 : 1,
  RETENTION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  BATCH_SIZE: 16384,
  LINGER_MS: 5,
  COMPRESSION_TYPE: 'gzip' as const,
};
