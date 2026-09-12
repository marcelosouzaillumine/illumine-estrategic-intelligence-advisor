import { Identifier, Timestamp } from '@illumine/core-primitives';

export interface CognitiveEvent {
  readonly eventId: Identifier;
  readonly eventType: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: Timestamp;
}
