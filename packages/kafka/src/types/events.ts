// Event types for Kafka integration

export interface MonitorExecutionEvent {
  eventId: string;
  timestamp: Date;
  monitorId: string;
  executionId: string;
  status: 'success' | 'failure' | 'timeout';
  responseTime?: number;
  statusCode?: number;
  error?: string;
  metadata: {
    region: string;
    workerInstance: string;
    retryCount: number;
  };
}

export interface AlertEvent {
  alertId: string;
  timestamp: Date;
  monitorId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'failure' | 'recovery' | 'performance';
  message: string;
  channels: string[];
  metadata: {
    consecutiveFailures?: number;
    lastSuccessTime?: Date;
    thresholdBreached?: boolean;
  };
}

export interface ConfigUpdateEvent {
  updateId: string;
  timestamp: Date;
  configType: 'monitor' | 'alert' | 'system';
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  payload: any;
  version: number;
  metadata: {
    userId?: string;
    source: string;
    validationHash: string;
  };
}

export interface ConfigErrorEvent {
  errorId: string;
  timestamp: Date;
  configType: 'monitor' | 'alert' | 'system';
  entityId: string;
  error: string;
  validationErrors?: string[];
  metadata: {
    userId?: string;
    source: string;
    originalPayload: any;
  };
}

export interface SystemHealthEvent {
  eventId: string;
  timestamp: Date;
  service: string;
  region: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
    activeConnections?: number;
    queueDepth?: number;
  };
  metadata: {
    version: string;
    uptime: number;
    lastHealthCheck: Date;
  };
}

export interface MetricsEvent {
  eventId: string;
  timestamp: Date;
  service: string;
  region: string;
  metrics: {
    [key: string]: number | string | boolean;
  };
  tags: {
    [key: string]: string;
  };
}

// Union type for all events
export type KafkaEvent = 
  | MonitorExecutionEvent 
  | AlertEvent 
  | ConfigUpdateEvent 
  | ConfigErrorEvent 
  | SystemHealthEvent 
  | MetricsEvent;

// Event type discriminator
export type EventType = 
  | 'monitor-execution'
  | 'alert'
  | 'config-update'
  | 'config-error'
  | 'system-health'
  | 'metrics';