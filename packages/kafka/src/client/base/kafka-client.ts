import { createAppLogger } from '../../utils/logger';
import { getConfig } from '../../config';
import { Kafka } from 'kafkajs';

const logger = createAppLogger('kafka-base-client');

export class KafkaClient {
  private static instance: KafkaClient | null = null;
  private kafka: Kafka | null = null;
  private readonly config = getConfig();

  private constructor() {}

  static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  async getKafka(): Promise<Kafka> {
    if (!this.kafka) {
      try {
        this.kafka = new Kafka({
          clientId: this.config.KAFKA_CLIENT_ID,
          brokers: this.config.KAFKA_BROKERS,
          ssl: this.config.KAFKA_SSL,
          sasl:
            this.config.KAFKA_USERNAME && this.config.KAFKA_PASSWORD
              ? {
                  mechanism: 'plain',
                  username: this.config.KAFKA_USERNAME,
                  password: this.config.KAFKA_PASSWORD,
                }
              : undefined,
          logLevel: 1,
        });

        logger.info('Kafka client initialized', {
          clientId: this.config.KAFKA_CLIENT_ID,
          brokers: this.config.KAFKA_BROKERS,
        });
      } catch (error) {
        logger.error('Failed to initialize Kafka client', error as Error);
        throw error;
      }
    }
    return this.kafka;
  }

  reset(): void {
    this.kafka = null;
    logger.info('Kafka client instance reset');
  }
}
