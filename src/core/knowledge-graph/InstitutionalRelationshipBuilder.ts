import { InstitutionalRelationship, InstitutionalRelationshipType } from "../../types/knowledge-graph/InstitutionalRelationship";

export class InstitutionalRelationshipBuilder {
  private sourceNodeId?: string;
  private targetNodeId?: string;
  private relationshipType?: InstitutionalRelationshipType;
  private confidenceLevel: InstitutionalRelationship["confidenceLevel"] = "VERIFIED";

  between(sourceNodeId: string, targetNodeId: string): this {
    this.sourceNodeId = sourceNodeId;
    this.targetNodeId = targetNodeId;
    return this;
  }

  ofType(type: InstitutionalRelationshipType): this {
    this.relationshipType = type;
    return this;
  }

  withConfidence(level: InstitutionalRelationship["confidenceLevel"]): this {
    this.confidenceLevel = level;
    return this;
  }

  build(): InstitutionalRelationship {
    if (!this.sourceNodeId || !this.targetNodeId || !this.relationshipType) {
      throw new Error("Missing required fields to build InstitutionalRelationship");
    }
    return {
      relationshipId: `KREL-${crypto.randomUUID()}`,
      sourceNodeId: this.sourceNodeId,
      targetNodeId: this.targetNodeId,
      relationshipType: this.relationshipType,
      confidenceLevel: this.confidenceLevel,
      createdAt: new Date().toISOString()
    };
  }
}
