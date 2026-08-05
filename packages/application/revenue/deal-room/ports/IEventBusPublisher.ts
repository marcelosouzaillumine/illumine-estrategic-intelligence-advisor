export interface IEventBusPublisher {
  publish(domainEvent: any): Promise<void>;
  publishAll(domainEvents: any[]): Promise<void>;
}
