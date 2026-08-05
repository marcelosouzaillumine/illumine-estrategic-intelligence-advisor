export type RelationshipType = 
  | "CAUSES"
  | "INFLUENCES"
  | "DEPENDS_ON"
  | "AMPLIFIES"
  | "CONFLICTS_WITH"
  | "REQUIRES_DECISION";

export interface EnterpriseRelationshipModel {
  sourceNodeId: string;
  targetNodeId: string;
  type: RelationshipType;
  confidence: number;
  impactWeight?: number;
  evidenceIds?: string[];
}
