import { Identifier } from '@illumine/core-primitives';

export interface OrgImpactRelationship {
  readonly edgeId: Identifier;
  readonly sourceId: Identifier;
  readonly targetId: Identifier;
  readonly relationshipType: 'DRIVES' | 'EXECUTES' | 'MONITORS' | 'RESOLVES' | 'PRODUCES';
  readonly weight: number;
}
