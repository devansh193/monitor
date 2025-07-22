export { KafkaClient } from './base/kafka-client';
export { ConnectionManager } from './base/connection-manager';

export { AdminClient } from './admin/admin-client';
export { TopicManager } from './admin/topic-manager';

export { ProducerClient } from './producer/producer-client';

import { ConnectionManager } from './base/connection-manager';
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

export { getProducerClient } from './producer/prroducer-client-registry';

// Global connection management
export async function disconnectAllClients(): Promise<void> {
  await connectionManager.disconnectAll();
  KafkaClient.getInstance().reset();
}

// Legacy exports for backward compatibility
export const getKafkaClient = async () => {
  return KafkaClient.getInstance().getKafka();
};
