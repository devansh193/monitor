export { KafkaClient } from './base/kafka-client';
export { ConnectionManager } from './base/connection-manager';

export { AdminClient } from './admin/admin-client';
export { TopicManager } from './admin/topic-manager';

export { ProducerClient } from './producer/producer-client';
export { MessageSender } from './producer/message-sender';

export { ConsumerClient } from './consumer/consumer-client';
export { MessageHandlerFactory } from './consumer/message-handler';
export type { MessageHandler } from './consumer/consumer-client';

import { ConnectionManager } from './base/connection-manager';
import { ProducerClient } from './producer/producer-client';
import { ConsumerClient } from './consumer/consumer-client';
import { AdminClient } from './admin/admin-client';
import { KafkaClient } from './base/kafka-client';

const connectionManager = new ConnectionManager();

export async function createKafkaClient(): Promise<KafkaClient> {
  return KafkaClient.getInstance();
}

export async function createAdminClient(clientId?: string): Promise<AdminClient> {
  const kafkaClient = await KafkaClient.getInstance().getKafka();
  return new AdminClient(kafkaClient, connectionManager, clientId);
}

export async function createProducerClient(clientId?: string): Promise<ProducerClient> {
  const kafkaClient = await KafkaClient.getInstance().getKafka();
  return new ProducerClient(kafkaClient, connectionManager, clientId);
}

export async function createConsumerClient(
  groupId: string,
  clientId?: string,
): Promise<ConsumerClient> {
  const kafkaClient = await KafkaClient.getInstance().getKafka();
  return new ConsumerClient(kafkaClient, groupId, connectionManager, clientId);
}

// Global connection management
export async function disconnectAllClients(): Promise<void> {
  await connectionManager.disconnectAll();
  KafkaClient.getInstance().reset();
}

// Legacy exports for backward compatibility
export const getKafkaClient = async () => {
  return KafkaClient.getInstance().getKafka();
};
