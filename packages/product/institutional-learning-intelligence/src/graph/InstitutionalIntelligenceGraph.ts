export interface GraphNode {
  readonly id: string;
  readonly type: 'CONTEXT' | 'DECISION' | 'OUTCOME' | 'LESSON' | 'PATTERN' | 'PRINCIPLE' | 'RECOMMENDATION';
}

export interface GraphEdge {
  readonly sourceId: string;
  readonly targetId: string;
  readonly relationType: 'INFLUENCES' | 'GENERATES' | 'VALIDATES' | 'DERIVED_FROM' | 'APPLIES_TO';
}

export interface InstitutionalIntelligenceGraph {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}
