export type InstitutionalRelationshipType = 
  | "CAUSES" | "INFLUENCES" | "SUPPORTS" | "BLOCKS" 
  | "DEPENDS_ON" | "MITIGATES" | "AGGRAVATES" 
  | "GENERATED_BY" | "DERIVED_FROM";

export interface InstitutionalRelationship {
  relationshipId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: InstitutionalRelationshipType;
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  createdAt: string;
}
