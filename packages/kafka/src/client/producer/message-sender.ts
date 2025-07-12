import {
  type MonitorRequestMessage,
  type MonitorResult,
  type AlertMessage,
  type HealthMetrics,
} from '../../types/monitor';
import { ProducerClient } from './producer-client';
import { KAFKA_TOPICS } from '../../types/kafka';

export class MessageSender {
  constructor(private readonly producer: ProducerClient) {}

  async sendMonitorRequest(topic: string, request: MonitorRequestMessage): Promise<void> {
    await this.producer.sendSingle(topic, request, request.configId);
  }

  async sendMonitorResult(result: MonitorResult): Promise<void> {
    await this.producer.sendSingle(KAFKA_TOPICS.HEALTH, result, result.configId);
  }

  async sendAlert(alert: AlertMessage): Promise<void> {
    await this.producer.sendSingle(KAFKA_TOPICS.ALERTS, alert, alert.configId);
  }

  async sendHealthMetrics(metrics: HealthMetrics): Promise<void> {
    await this.producer.sendSingle(KAFKA_TOPICS.HEALTH, metrics, metrics.region);
  }

  async sendBatchMonitorRequests(
    requests: Array<{
      topic: string;
      request: MonitorRequestMessage;
    }>,
  ): Promise<void> {
    const topicMessages = requests.reduce(
      (acc, { topic, request }) => {
        const existing = acc.find((tm) => tm.topic === topic);
        if (existing) {
          existing.messages.push(request);
        } else {
          acc.push({
            topic,
            messages: [request],
            partitionKey: request.configId,
          });
        }
        return acc;
      },
      [] as Array<{ topic: string; messages: MonitorRequestMessage[]; partitionKey: string }>,
    );

    await this.producer.sendBatch(topicMessages);
  }
}
