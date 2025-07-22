export const SUPPORTED_INTERVALS = [30, 60, 300] as const;
export type SupportedInterval = (typeof SUPPORTED_INTERVALS)[number];

export const KAFKA_TOPICS = {
  MONITOR_30S: 'monitor-30s',
  MONITOR_1M: 'monitor-1m',
  MONITOR_5M: 'monitor-5m',
  ALERTS: 'monitor-alerts',
  HEALTH: 'monitor-health',
  DLQ: 'monitor-dlq',
  MONITOR_EXECUTIONS: 'monitor-executions',
  MONITOR_FAILURES: 'monitor-failures',
  MONITOR_RECOVERIES: 'monitor-recoveries',
  ALERTS_V2: 'alerts',
  ALERTS_DLQ: 'alerts-dlq',
  CONFIG_UPDATES: 'config-updates',
  CONFIG_ERRORS: 'config-errors',
  SYSTEM_HEALTH: 'system-health',
  METRICS: 'metrics',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
