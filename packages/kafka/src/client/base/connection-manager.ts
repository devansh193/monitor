import { type Admin, type Consumer, type Producer } from 'kafkajs';
import { createAppLogger } from '../../utils/logger';

const logger = createAppLogger('kafka-connection-manager');

export class ConnectionManager {
  private readonly connections = new Map<
    string,
    {
      client: Admin | Consumer | Producer;
      type: 'admin' | 'consumer' | 'producer';
      connected: boolean;
    }
  >();

  async registerConnection(
    id: string,
    client: Admin | Consumer | Producer,
    type: 'admin' | 'consumer' | 'producer',
  ): Promise<void> {
    try {
      await client.connect();
      this.connections.set(id, { client, type, connected: true });
      logger.info(`${type} connection registered`, { id });
    } catch (error) {
      logger.error(`Failed to register ${type} connection`, error as Error, { id });
      throw error;
    }
  }

  async disconnectConnection(id: string): Promise<void> {
    const connection = this.connections.get(id);
    if (connection && connection.connected) {
      try {
        await connection.client.disconnect();
        this.connections.set(id, { ...connection, connected: false });
        logger.info(`${connection.type} connection disconnected`, { id });
      } catch (error) {
        logger.error(`Failed to disconnect ${connection.type}`, error as Error, { id });
        throw error;
      }
    }
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.connections.keys()).map((id) =>
      this.disconnectConnection(id),
    );

    await Promise.allSettled(disconnectPromises);
    logger.info('All connections disconnected');
  }

  getConnection(id: string): (Admin | Consumer | Producer) | undefined {
    return this.connections.get(id)?.client;
  }

  isConnected(id: string): boolean {
    return this.connections.get(id)?.connected ?? false;
  }
}
