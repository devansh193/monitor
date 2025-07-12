export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
export type MonitorStatus = 'active' | 'inactive' | 'paused';
export type UptimeStatus = 'UP' | 'DOWN' | 'UNKNOWN';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface MonitoringConfig {
  readonly id: string;
  readonly userId: string;
  readonly url: string;
  readonly httpMethod: HttpMethod;
  readonly httpHeaders?: Readonly<Record<string, string>>;
  readonly requestBody?: string;
  readonly expectedStatusCode: number;
  readonly intervalSeconds: number;
  readonly timeoutMs: number;
  readonly region?: string;
  readonly status: MonitorStatus;
  readonly retryCount: number;
  readonly alertThreshold: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastCheckedAt?: Date;
  readonly nextCheckAt?: Date;
}

export interface MonitorRequestMessage {
  readonly configId: string;
  readonly url: string;
  readonly method: HttpMethod;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly expectedStatusCode: number;
  readonly intervalSeconds: number;
  readonly timeoutMs: number;
  readonly region?: string;
  readonly scheduledAt: number;
  readonly attempt: number;
  readonly maxRetries: number;
}

export interface MonitorResult {
  readonly configId: string;
  readonly timestamp: Date;
  readonly isUp: boolean;
  readonly statusCode?: number;
  readonly responseTimeMs?: number;
  readonly errorMessage?: string;
  readonly region: string;
  readonly attempt: number;
  readonly dnsLookupMs?: number;
  readonly tcpConnectMs?: number;
  readonly tlsHandshakeMs?: number;
  readonly firstByteMs?: number;
}

export interface AlertMessage {
  readonly configId: string;
  readonly url: string;
  readonly status: UptimeStatus;
  readonly timestamp: Date;
  readonly reason?: string;
  readonly region: string;
  readonly userId: string;
  readonly severity: AlertSeverity;
  readonly consecutiveFailures: number;
  readonly responseTime?: number;
}

export interface HealthMetrics {
  readonly timestamp: Date;
  readonly region: string;
  readonly activeMonitors: number;
  readonly checksPerSecond: number;
  readonly avgResponseTime: number;
  readonly errorRate: number;
  readonly queueDepth: number;
}

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
