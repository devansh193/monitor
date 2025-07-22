import { getTopicConfig, getAllTopicConfigs } from '../../config/topic-configs';
import { KAFKA_TOPICS } from '../../types/kafka';
import { AdminClient } from './admin-client';

export class TopicManager {
  constructor(private readonly adminClient: AdminClient) {}

  async createMonitorTopics(): Promise<void> {
    const monitorTopics = Object.values(KAFKA_TOPICS)
      .filter((topic) => topic.startsWith('monitor-'))
      .map((topic) => {
        const config = getTopicConfig(topic);
        return {
          topic,
          numPartitions: config.partitions,
          replicationFactor: config.replicationFactor,
        };
      });

    await this.adminClient.createTopics(monitorTopics);
  }

  async createSystemTopics(): Promise<void> {
    const systemTopics = [KAFKA_TOPICS.ALERTS, KAFKA_TOPICS.HEALTH, KAFKA_TOPICS.DLQ].map(
      (topic) => {
        const config = getTopicConfig(topic);
        return {
          topic,
          numPartitions: config.partitions,
          replicationFactor: config.replicationFactor,
        };
      },
    );

    await this.adminClient.createTopics(systemTopics);
  }

  async createAllTopics(): Promise<void> {
    await Promise.all([this.createMonitorTopics(), this.createSystemTopics()]);
  }

  async createAllTopicsWithDetailedConfig(): Promise<void> {
    const allConfigs = getAllTopicConfigs();
    const topicsToCreate = Object.entries(allConfigs).map(([topic, config]) => ({
      topic,
      numPartitions: config.partitions,
      replicationFactor: config.replicationFactor,
    }));

    await this.adminClient.createTopics(topicsToCreate);
  }

  async deleteAllTopics(): Promise<void> {
    const allTopics = Object.values(KAFKA_TOPICS);
    await this.adminClient.deleteTopics(allTopics);
  }
}
