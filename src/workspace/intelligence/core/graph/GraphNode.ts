import { EnterpriseNodeType, GraphNodeMetadata } from './graph.types';

export class GraphNode {
  public id: string;
  public label: string;
  public type: EnterpriseNodeType;
  public metadata: GraphNodeMetadata;
  public createdAt: string;
  public updatedAt: string;

  constructor(
    id: string, 
    label: string, 
    type: EnterpriseNodeType, 
    metadata: GraphNodeMetadata = {}
  ) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.metadata = metadata;
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  updateMetadata(newMetadata: Partial<GraphNodeMetadata>) {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.updatedAt = new Date().toISOString();
  }
}
