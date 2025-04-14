import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PubSub, Subscription, Topic } from '@google-cloud/pubsub';
import { GcpService } from '../gcp.service';

@Injectable()
export class PubSubService implements OnModuleDestroy {
  private pubsub: PubSub;
  private subscriptions: Subscription[] = [];

  constructor(private readonly gcpService: GcpService) {
    this.pubsub = new PubSub({
      projectId: this.gcpService.getProjectId(),
      credentials: this.gcpService.getCredentials(),
    });
  }

  async onModuleDestroy() {
    await Promise.all(this.subscriptions.map(sub => sub.close()));
  }

  async createTopic(topicName: string): Promise<Topic> {
    const [topic] = await this.pubsub.createTopic(topicName);
    return topic;
  }

  async deleteTopic(topicName: string): Promise<void> {
    const topic = this.pubsub.topic(topicName);
    await topic.delete();
  }

  async publishMessage<T extends Record<string, any>>(
    topicName: string,
    data: T,
  ): Promise<string> {
    const topic = this.pubsub.topic(topicName);
    const messageId = await topic.publish(Buffer.from(JSON.stringify(data)));
    return messageId;
  }

  async createSubscription(
    topicName: string,
    subscriptionName: string,
  ): Promise<Subscription> {
    const topic = this.pubsub.topic(topicName);
    const [subscription] = await topic.createSubscription(subscriptionName);
    return subscription;
  }

  async deleteSubscription(subscriptionName: string): Promise<void> {
    const subscription = this.pubsub.subscription(subscriptionName);
    await subscription.delete();
  }

  subscribe(
    subscriptionName: string,
    messageHandler: (message: any) => Promise<void>,
  ): void {
    const subscription = this.pubsub.subscription(subscriptionName);

    subscription.on('message', message => {
      try {
        const data = JSON.parse(message.data.toString());
        messageHandler(data).then(() => {
          message.ack();
        });
      } catch (error) {
        console.error(`Error in message ${subscriptionName}:`, error);
        message.nack();
      }
    });

    subscription.on('error', error => {
      console.error(`Error in subscription ${subscriptionName}:`, error);
    });

    this.subscriptions.push(subscription);
  }

  async listTopics(): Promise<string[]> {
    const [topics] = await this.pubsub.getTopics();
    return topics.map(topic => topic.name);
  }

  async listSubscriptions(topicName: string): Promise<string[]> {
    const topic = this.pubsub.topic(topicName);
    const [subscriptions] = await topic.getSubscriptions();
    return subscriptions.map(sub => sub.name);
  }
}
