import { Identifier, Version, Timestamp } from '@illumine/core-primitives';

export interface IntelligenceIdentity {
  readonly id: Identifier;
  readonly source: string;
  readonly capability: string;
  readonly version: Version;
  readonly generatedAt: Timestamp;
}
