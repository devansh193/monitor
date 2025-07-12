import { type Consumer, type Kafka, type EachMessagePayload } from 'kafkajs';
import { ConnectionManager } from '../base/connection-manager';
import { createAppLogger } from '../../utils/logger';

const logger = createAppLogger('kafka-consumer-client');

export type MessageHandler<T> = (message: T, payload: EachMessagePayload) => Promise<void>;

export class ConsumerClient {
  private consumer: Consumer | null = null;
  private readonly connectionManager: ConnectionManager;
  private readonly clientId: string;

  constructor(
    private readonly kafka: Kafka,
    private readonly groupId: string,
    connectionManager: ConnectionManager,
    clientId?: string,
  ) {
    this.connectionManager = connectionManager;
    this.clientId = clientId || `consumer-${groupId}`;
  }

  async getConsumer(): Promise<Consumer> {
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({ groupId: this.groupId });
      await this.connectionManager.registerConnection(this.clientId, this.consumer, 'consumer');
    }
    return this.consumer;
  }

  async disconnect(): Promise<void> {
    if (this.consumer) {
      await this.connectionManager.disconnectConnection(this.clientId);
      this.consumer = null;
    }
  }

  async subscribe(topics: string[], fromBeginning: boolean = false): Promise<void> {
    const consumer = await this.getConsumer();

    try {
      for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning });
        logger.info('Consumer subscribed to topic', {
          groupId: this.groupId,
          topic,
        });
      }
    } catch (error) {
      logger.error('Failed to subscribe to topics', error as Error, {
        groupId: this.groupId,
        topics,
      });
      throw error;
    }
  }

  async run<T>(messageHandler: MessageHandler<T>): Promise<void> {
    const consumer = await this.getConsumer();

    try {
      await consumer.run({
        eachMessage: async (payload) => {
          const { topic, partition, message } = payload;

          if (!message.value) {
            logger.warn('Received null message value', { topic, partition });
            return;
          }

          try {
            const parsedMessage: T = JSON.parse(message.value.toString());
            await messageHandler(parsedMessage, payload);
            await payload.heartbeat();
          } catch (error) {
            logger.error('Error processing message', error as Error, {
              topic,
              partition,
              offset: message.offset,
            });
            // Consider implementing dead letter queue logic here
          }
        },
      });
    } catch (error) {
      logger.error('Failed to run consumer', error as Error, {
        groupId: this.groupId,
      });
      throw error;
    }
  }

  async subscribeAndRun<T>(
    topics: string[],
    messageHandler: MessageHandler<T>,
    fromBeginning: boolean = false,
  ): Promise<void> {
    await this.subscribe(topics, fromBeginning);
    await this.run(messageHandler);

    // Set up graceful shutdown
    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
    const exitHandler = async () => {
      try {
        await this.disconnect();
        logger.info('Consumer gracefully shut down', { groupId: this.groupId });
      } catch (error) {
        logger.error('Error during graceful shutdown', error as Error, {
          groupId: this.groupId,
        });
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGTERM', exitHandler);
    process.on('SIGINT', exitHandler);
  }
}
