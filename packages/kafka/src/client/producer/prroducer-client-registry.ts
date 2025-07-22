import { ConnectionManager } from '../base/connection-manager';
import { KafkaClient } from '../base/kafka-client';
import { ProducerClient } from './producer-client';

const producerClients = new Map<string, ProducerClient>();
const connectionManager = new ConnectionManager();
export const getProducerClient = async (clientId = 'default-producer') => {
  if (producerClients.has(clientId)) {
    return producerClients.get(clientId)!;
  }
  const kafkaClient = await KafkaClient.getInstance().getKafka();
  const producerClient = new ProducerClient(kafkaClient, connectionManager, clientId);

  producerClients.set(clientId, producerClient);
  return producerClient;
};
