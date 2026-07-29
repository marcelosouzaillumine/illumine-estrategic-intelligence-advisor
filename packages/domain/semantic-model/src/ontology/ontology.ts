import { SemanticEntity, SemanticRelationship } from '../kernel/semantic-kernel';

export interface OntologicalNode extends SemanticEntity {
  readonly category: 'METRIC' | 'PROCESS' | 'ASSET' | 'RISK' | 'POLICY' | 'DECISION';
}

export interface OntologicalEdge extends SemanticRelationship {
  readonly causalDirection: 'FORWARD' | 'BIDIRECTIONAL';
}

export interface EnterpriseOntology {
  readonly nodes: OntologicalNode[];
  readonly edges: OntologicalEdge[];
}
