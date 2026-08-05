export interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  occurredAt: string;
  version: number;
  actor: { actorId: string; actorType: string };
  metadata?: Record<string, any>;
}
