export interface DomainEvent {
  eventId: string;
  type: string;
  timestamp: string;
  payload: any;
  metadata?: {
    correlationId?: string;
    userId?: string;
    tenantId?: string;
  };
}

type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
  private static handlers: Map<string, EventHandler[]> = new Map();

  static subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  static async publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${event.type}`, error);
      }
    }
  }
}

// Built-in Event Creators
export const createSnapshotCreatedEvent = (snapshotId: string, tenantId: string): DomainEvent => ({
  eventId: crypto.randomUUID(),
  type: 'SnapshotCreated',
  timestamp: new Date().toISOString(),
  payload: { snapshotId },
  metadata: { tenantId }
});

export const createCacheInvalidatedEvent = (key: string): DomainEvent => ({
  eventId: crypto.randomUUID(),
  type: 'CacheInvalidated',
  timestamp: new Date().toISOString(),
  payload: { key }
});
