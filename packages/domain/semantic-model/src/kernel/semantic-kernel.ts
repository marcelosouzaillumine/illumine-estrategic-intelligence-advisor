import { Identifier, Version, Timestamp } from '@illumine/core-primitives';

export type SemanticIdentifier = Identifier;
export type SemanticVersion = Version;

export interface SemanticEntity {
  readonly id: SemanticIdentifier;
  readonly type: string;
  readonly version: SemanticVersion;
  readonly label: string;
  readonly description: string;
  readonly createdAt: Timestamp;
}

export interface SemanticRelationship {
  readonly id: SemanticIdentifier;
  readonly sourceEntityId: SemanticIdentifier;
  readonly targetEntityId: SemanticIdentifier;
  readonly relationshipType: 'INFLUENCES' | 'IMPACTS' | 'DERIVES_FROM' | 'REQUIRES' | 'GOVERNS';
  readonly strength: number; // 0 a 1
}
