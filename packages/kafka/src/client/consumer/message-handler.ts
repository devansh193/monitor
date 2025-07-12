import {
  type MonitorRequestMessage,
  type MonitorResult,
  type AlertMessage,
  type HealthMetrics,
} from '../../types/monitor';
import { type MessageHandler } from './consumer-client';
import { createAppLogger } from '../../utils/logger';

const logger = createAppLogger('kafka-message-handler');

export class MessageHandlerFactory {
  createMonitorRequestHandler(
    processor: (request: MonitorRequestMessage) => Promise<void>,
  ): MessageHandler<MonitorRequestMessage> {
    return async (message, payload) => {
      try {
        await processor(message);
        logger.debug('Monitor request processed', {
          configId: message.configId,
          topic: payload.topic,
        });
      } catch (error) {
        logger.error('Error processing monitor request', error as Error, {
          configId: message.configId,
          topic: payload.topic,
        });
        throw error;
      }
    };
  }

  createMonitorResultHandler(
    processor: (result: MonitorResult) => Promise<void>,
  ): MessageHandler<MonitorResult> {
    return async (message, payload) => {
      try {
        await processor(message);
        logger.debug('Monitor result processed', {
          configId: message.configId,
          topic: payload.topic,
        });
      } catch (error) {
        logger.error('Error processing monitor result', error as Error, {
          configId: message.configId,
          topic: payload.topic,
        });
        throw error;
      }
    };
  }

  createAlertHandler(
    processor: (alert: AlertMessage) => Promise<void>,
  ): MessageHandler<AlertMessage> {
    return async (message, payload) => {
      try {
        await processor(message);
        logger.debug('Alert processed', {
          configId: message.configId,
          topic: payload.topic,
        });
      } catch (error) {
        logger.error('Error processing alert', error as Error, {
          configId: message.configId,
          topic: payload.topic,
        });
        throw error;
      }
    };
  }

  createHealthMetricsHandler(
    processor: (metrics: HealthMetrics) => Promise<void>,
  ): MessageHandler<HealthMetrics> {
    return async (message, payload) => {
      try {
        await processor(message);
        logger.debug('Health metrics processed', {
          region: message.region,
          topic: payload.topic,
        });
      } catch (error) {
        logger.error('Error processing health metrics', error as Error, {
          region: message.region,
          topic: payload.topic,
        });
        throw error;
      }
    };
  }
}
