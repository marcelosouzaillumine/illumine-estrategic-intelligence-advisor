export type KnowledgeRelationshipType = 'HAS_DECISION' | 'HAS_EVIDENCE' | 'GENERATED_RECOMMENDATION' | 'TRIGGERED_ACTION' | 'PRODUCED_OUTCOME' | 'DETECTED_PATTERN' | 'DERIVED_LEARNING';

export interface KnowledgeGraphRelationship {
  readonly relationshipId: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly type: KnowledgeRelationshipType;
  readonly weight: number;
}
