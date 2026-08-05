import { IEventBusPublisher } from '../../application/revenue/deal-room/ports/IEventBusPublisher';

// Mock event bus. In a real environment, this might connect to Cloud Pub/Sub, Kafka, or Firebase Functions.
export class InMemoryEventBusPublisher implements IEventBusPublisher {
  
  private handlers: Record<string, Function[]> = {};

  // For intra-process Sagas (like RevenueProcessManager) to subscribe
  public subscribe(eventName: string, handler: Function) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  async publish(domainEvent: any): Promise<void> {
    console.log(`[EventBus] Publishing event: ${domainEvent.eventName}`, domainEvent);
    
    const eventHandlers = this.handlers[domainEvent.eventName] || [];
    for (const handler of eventHandlers) {
      try {
        // Fire asynchronously to decouple
        setTimeout(() => handler(domainEvent), 0);
      } catch (e) {
        console.error(`[EventBus] Error in handler for ${domainEvent.eventName}`, e);
      }
    }
  }

  async publishAll(domainEvents: any[]): Promise<void> {
    for (const event of domainEvents) {
      await this.publish(event);
    }
  }
}
