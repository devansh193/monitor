import { createLogger, format, transports, type Logger } from 'winston';

const { combine, timestamp, errors, json, colorize, simple } = format;

export interface LogContext {
  readonly service?: string;
  readonly region?: string;
  readonly configId?: string;
  readonly userId?: string;
  readonly correlationId?: string;
  readonly [key: string]: unknown;
}

class AppLogger {
  private readonly logger: Logger;

  constructor(service: string) {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(timestamp(), errors({ stack: true }), json()),
      defaultMeta: { service },
      transports: [
        new transports.Console({
          format: process.env.NODE_ENV === 'development' ? combine(colorize(), simple()) : json(),
        }),
      ],
      exceptionHandlers: [new transports.Console()],
      rejectionHandlers: [new transports.Console()],
    });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, { ...context, error: error?.stack });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }
}

export const createAppLogger = (service: string): AppLogger => new AppLogger(service);
