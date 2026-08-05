export interface DomainEvent {
  id: string;
  type: string;
  timestamp: string;
  payload: any;
  metadata?: Record<string, any>;
}

export interface EventSubscriber {
  supports(event: DomainEvent): boolean;
  handle(event: DomainEvent): Promise<void>;
}

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  subscribe(subscriber: EventSubscriber): void;
}
