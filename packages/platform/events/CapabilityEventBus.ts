import { CapabilityEvent } from './CapabilityEvent';

export type EventHandler<TPayload> = (event: CapabilityEvent<TPayload>) => Promise<void>;

export interface CapabilityEventBus {
  publish<TPayload>(event: CapabilityEvent<TPayload>): Promise<void>;
  subscribe<TPayload>(eventType: string, handler: EventHandler<TPayload>): void;
}
