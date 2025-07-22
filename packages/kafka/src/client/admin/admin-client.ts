import { ConnectionManager } from '../base/connection-manager';
import { createAppLogger } from '../../utils/logger';
import { type Admin, type Kafka } from 'kafkajs';

const logger = createAppLogger('kafka-admin-client');

interface Topic {
  topic: string;
  numPartitions: number;
  replicationFactor: number;
}

export class AdminClient {
  private admin: Admin | null = null;
  private readonly connectionManager: ConnectionManager;
  private readonly clientId: string;

  constructor(
    private readonly kafka: Kafka,
    connectionManager: ConnectionManager,
    clientId: string = 'admin',
  ) {
    this.connectionManager = connectionManager;
    this.clientId = clientId;
  }

  async getAdmin(): Promise<Admin> {
    if (!this.admin) {
      this.admin = this.kafka.admin();
      await this.connectionManager.registerConnection(this.clientId, this.admin, 'admin');
    }
    return this.admin;
  }

  async disconnect(): Promise<void> {
    if (this.admin) {
      await this.connectionManager.disconnectConnection(this.clientId);
      this.admin = null;
    }
  }

  async createTopics(topics: Topic[]): Promise<void> {
    const admin = await this.getAdmin();

    try {
      const existingTopics = await admin.listTopics();
      const topicsToCreate = topics.filter((t) => !existingTopics.includes(t.topic));

      if (topicsToCreate.length === 0) {
        logger.info('All required Kafka topics already exist');
        return;
      }

      const success = await admin.createTopics({
        waitForLeaders: true,
        topics: topicsToCreate.map((t) => ({
          topic: t.topic,
          numPartitions: t.numPartitions,
          replicationFactor: t.replicationFactor,
        })),
      });

      if (success) {
        logger.info('Successfully created Kafka topics', {
          topics: topicsToCreate.map((t) => t.topic),
        });
      } else {
        logger.warn('Failed to create some Kafka topics - they might already exist');
      }
    } catch (error) {
      logger.error('Error creating Kafka topics', error as Error);
      throw error;
    }
  }

  async deleteTopics(topics: string[]): Promise<void> {
    const admin = await this.getAdmin();

    try {
      await admin.deleteTopics({
        topics,
        timeout: 30000,
      });
      logger.info('Successfully deleted Kafka topics', { topics });
    } catch (error) {
      logger.error('Error deleting Kafka topics', error as Error, { topics });
      throw error;
    }
  }

  async listTopics(): Promise<string[]> {
    const admin = await this.getAdmin();
    try {
      return await admin.listTopics();
    } catch (error) {
      logger.error('Error listing Kafka topics', error as Error);
      throw error;
    }
  }
}
