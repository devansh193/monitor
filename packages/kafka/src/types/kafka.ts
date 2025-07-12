export const SUPPORTED_INTERVALS = [5, 10, 15, 30, 60, 120, 300, 600, 1800, 3600] as const;
export type SupportedInterval = (typeof SUPPORTED_INTERVALS)[number];

export const KAFKA_TOPICS = {
  MONITOR_5S: 'monitor-5s',
  MONITOR_10S: 'monitor-10s',
  MONITOR_15S: 'monitor-15s',
  MONITOR_30S: 'monitor-30s',
  MONITOR_1M: 'monitor-1m',
  MONITOR_2M: 'monitor-2m',
  MONITOR_5M: 'monitor-5m',
  MONITOR_10M: 'monitor-10m',
  MONITOR_30M: 'monitor-30m',
  MONITOR_1H: 'monitor-1h',
  ALERTS: 'monitor-alerts',
  HEALTH: 'monitor-health',
  DLQ: 'monitor-dlq',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
