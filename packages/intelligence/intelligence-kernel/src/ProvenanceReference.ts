import { Identifier } from '@illumine/core-primitives';

export interface ProvenanceReference {
  readonly sourceId: Identifier;
  readonly evidenceIds: Identifier[];
  readonly lineageHash: string;
}
