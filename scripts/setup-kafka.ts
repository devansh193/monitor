import { KafkaConnectionManager } from '../packages/kafka/src/connections/connection-manager';
import { KafkaAdminManager } from '../packages/kafka/src/admin/admin-client';
import { TOPIC_CONFIGS } from '../packages/kafka/src/config/topic-config';
import { TopicManager } from '../packages/kafka/src/admin/topic-client';
import { KafkaService } from '../packages/kafka/src/client/kafka';

async function setupKafkaTopics() {
  console.log('🚀 Setting up Kafka topics...');

  const kafkaService = KafkaService.getInstance();
  const kafka = await kafkaService.getKafkaClient();

  const connectionManager = new KafkaConnectionManager();
  const adminManager = new KafkaAdminManager(kafka, connectionManager, 'admin');
  const topicManager = TopicManager.getInstance(adminManager);

  try {
    const topicsToCreate = Object.entries(TOPIC_CONFIGS).map(([topic, config]) => ({
      topic,
      numPartitions: config.partitions,
      replicationFactor: config.replicationFactor,
    }));

    console.log(`📝 Creating ${topicsToCreate.length} topics...`);

    await topicManager.createTopic(topicsToCreate);

    const allTopics = await topicManager.listTopic();
    console.log('📋 All existing topics:', allTopics);
  } catch (error) {
    console.error('❌ Error setting up Kafka topics:', error);
    process.exit(1);
  } finally {
    await adminManager.disconnect();
    console.log('🔌 Disconnected from Kafka Admin');
  }
  console.log('🎉 Kafka topics setup completed successfully!');
}

setupKafkaTopics();
