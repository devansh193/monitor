import { KAFKA_CONFIG } from '../../config/topics';
import { KAFKA_TOPICS } from '../../types/kafka';
import { AdminClient } from './admin-client';

export class TopicManager {
  constructor(private readonly adminClient: AdminClient) {}

  async createMonitorTopics(): Promise<void> {
    const monitorTopics = Object.values(KAFKA_TOPICS)
      .filter((topic) => topic.startsWith('monitor-'))
      .map((topic) => ({
        topic,
        numPartitions: KAFKA_CONFIG.PARTITIONS_PER_TOPIC,
        replicationFactor: KAFKA_CONFIG.REPLICATION_FACTOR,
      }));

    await this.adminClient.createTopics(monitorTopics);
  }

  async createSystemTopics(): Promise<void> {
    const systemTopics = [KAFKA_TOPICS.ALERTS, KAFKA_TOPICS.HEALTH, KAFKA_TOPICS.DLQ].map(
      (topic) => ({
        topic,
        numPartitions: KAFKA_CONFIG.PARTITIONS_PER_TOPIC,
        replicationFactor: KAFKA_CONFIG.REPLICATION_FACTOR,
      }),
    );

    await this.adminClient.createTopics(systemTopics);
  }

  async createAllTopics(): Promise<void> {
    await Promise.all([this.createMonitorTopics(), this.createSystemTopics()]);
  }

  async deleteAllTopics(): Promise<void> {
    const allTopics = Object.values(KAFKA_TOPICS);
    await this.adminClient.deleteTopics(allTopics);
  }
}
