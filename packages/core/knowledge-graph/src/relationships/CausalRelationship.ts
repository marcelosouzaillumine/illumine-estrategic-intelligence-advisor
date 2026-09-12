import { Identifier } from '@illumine/core-primitives';

export interface CausalRelationship {
  readonly relationshipId: Identifier;
  readonly sourceNodeId: Identifier;
  readonly targetNodeId: Identifier;
  readonly impactWeight: number; // -1.0 a +1.0
  readonly causalDirection: 'DIRECT' | 'INVERSE';
  readonly confidence: number;
}
