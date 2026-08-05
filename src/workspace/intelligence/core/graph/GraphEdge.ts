import { EnterpriseRelationshipType, IntelligenceEdgeMetadata } from './graph.types';

export class GraphEdge {
  public id: string;
  public sourceId: string;
  public targetId: string;
  public relationship: EnterpriseRelationshipType;
  public confidence: number; // 0.0 to 1.0
  public weight: number;     // 0.0 to 1.0 (magnitude of impact/relation)
  public metadata: IntelligenceEdgeMetadata;
  public createdAt: string;
  public updatedAt: string;

  constructor(
    sourceId: string,
    targetId: string,
    relationship: EnterpriseRelationshipType,
    confidence: number = 1.0,
    weight: number = 1.0,
    metadata: IntelligenceEdgeMetadata = {}
  ) {
    this.id = `${sourceId}-${relationship}-${targetId}`;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.relationship = relationship;
    this.confidence = confidence;
    this.weight = weight;
    this.metadata = metadata;
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  updateEdge(confidence?: number, weight?: number, metadata?: Partial<IntelligenceEdgeMetadata>) {
    if (confidence !== undefined) this.confidence = confidence;
    if (weight !== undefined) this.weight = weight;
    if (metadata) {
      this.metadata = { ...this.metadata, ...metadata };
    }
    this.updatedAt = new Date().toISOString();
  }
}
