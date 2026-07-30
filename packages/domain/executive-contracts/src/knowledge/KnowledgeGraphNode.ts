export type KnowledgeNodeType = 'COMPANY' | 'DECISION' | 'EVIDENCE' | 'RECOMMENDATION' | 'ACTION' | 'OUTCOME' | 'PATTERN' | 'LEARNING';

export interface KnowledgeGraphNode {
  readonly nodeId: string;
  readonly nodeType: KnowledgeNodeType;
  readonly label: string;
  readonly properties: Record<string, unknown>;
}
