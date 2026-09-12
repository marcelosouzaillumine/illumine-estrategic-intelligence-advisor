export type EvidenceSourceType = 'EVALUATION' | 'EVOLUTION' | 'CERTIFICATION';

export interface EvidenceNode {
  readonly id: string;
  readonly type: EvidenceSourceType;
  readonly referenceId: string;
}

export interface EvidenceEdge {
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly relation: string;
}

export interface AdvisoryEvidenceGraph {
  readonly nodes: readonly EvidenceNode[];
  readonly edges: readonly EvidenceEdge[];
}
