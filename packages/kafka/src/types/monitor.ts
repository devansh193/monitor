import type { HttpMethod, MonitorStatus, UptimeStatus, AlertSeverity } from './common';

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
