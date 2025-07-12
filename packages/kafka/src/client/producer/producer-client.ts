import { type Producer, type Kafka, type ProducerRecord } from 'kafkajs';
import { ConnectionManager } from '../base/connection-manager';
import { createAppLogger } from '../../utils/logger';

const logger = createAppLogger('kafka-producer-client');

export class ProducerClient {
  private producer: Producer | null = null;
  private readonly connectionManager: ConnectionManager;
  private readonly clientId: string;

  constructor(
    private readonly kafka: Kafka,
    connectionManager: ConnectionManager,
    clientId: string = 'producer',
  ) {
    this.connectionManager = connectionManager;
    this.clientId = clientId;
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.connectionManager.registerConnection(this.clientId, this.producer, 'producer');
    }
    return this.producer;
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.connectionManager.disconnectConnection(this.clientId);
      this.producer = null;
    }
  }

  async send<T>(topic: string, messages: T[], partitionKey?: string): Promise<void> {
    const producer = await this.getProducer();

    try {
      const records: ProducerRecord['messages'] = messages.map((message) => ({
        value: JSON.stringify(message),
        key: partitionKey,
      }));

      await producer.send({
        topic,
        messages: records,
        acks: -1,
      });

      logger.info('Messages sent successfully', {
        topic,
        messageCount: messages.length,
        partitionKey,
      });
    } catch (error) {
      logger.error('Failed to send messages', error as Error, {
        topic,
        messageCount: messages.length,
        partitionKey,
      });
      throw error;
    }
  }

  async sendSingle<T>(topic: string, message: T, partitionKey?: string): Promise<void> {
    await this.send(topic, [message], partitionKey);
  }

  async sendBatch<T>(
    topicMessages: Array<{
      topic: string;
      messages: T[];
      partitionKey?: string;
    }>,
  ): Promise<void> {
    const producer = await this.getProducer();

    try {
      const batch: ProducerRecord[] = topicMessages.map(({ topic, messages, partitionKey }) => ({
        topic,
        messages: messages.map((message) => ({
          value: JSON.stringify(message),
          key: partitionKey,
        })),
        acks: -1,
      }));

      await producer.sendBatch({
        topicMessages: batch,
      });

      logger.info('Batch messages sent successfully', {
        topicCount: topicMessages.length,
        totalMessages: topicMessages.reduce((sum, tm) => sum + tm.messages.length, 0),
      });
    } catch (error) {
      logger.error('Failed to send batch messages', error as Error, {
        topicCount: topicMessages.length,
      });
      throw error;
    }
  }
}
