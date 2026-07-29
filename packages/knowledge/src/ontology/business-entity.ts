export interface Relationship {
  sourceId: string;
  targetId: string;
  relationType: 'DEPENDS_ON' | 'GOVERNS' | 'MANAGES' | 'CONTAINS';
}

export interface KnowledgeNode {
  id: string;
  domain: string;
  confidence: number;
  source: string;
}

export interface BusinessEntity {
  id: string;
  type: 'CUSTOMER' | 'PROCESS' | 'ASSET' | 'RISK' | 'CAPABILITY';
  attributes: Record<string, unknown>;
  relationships: Relationship[];
  knowledgeNode: KnowledgeNode;
}
