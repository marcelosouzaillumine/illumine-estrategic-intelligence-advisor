export interface KnowledgeRelationship {
  id: string;
  tenantId: string;
  fromArtifact: string;
  relationship: "depends_on" | "derived_from" | "supports" | "contradicts" | "impacts" | "approved_by";
  toArtifact: string;
  confidence: number;
  createdAt: Date;
}
