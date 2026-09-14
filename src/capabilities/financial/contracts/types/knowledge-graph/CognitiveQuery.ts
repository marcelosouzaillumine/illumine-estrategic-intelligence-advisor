import { InstitutionalNode } from "../../../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../../../types/knowledge-graph/InstitutionalRelationship";
import { CognitivePath } from "../../../../../types/knowledge-graph/CognitivePath";

export type CognitiveQueryType = 
  | 'ROOT_CAUSE'
  | 'IMPACT_ANALYSIS'
  | 'EVIDENCE_TRACE'
  | 'DECISION_TRACE'
  | 'RISK_CLUSTER'
  | 'CAUSAL_PATH';

export interface CognitiveQuery {
  queryId: string;
  queryType: CognitiveQueryType;
  targetNodeId?: string;
  sourceNodeId?: string;
  depth: number;
  filters?: Record<string, string>;
  requestedAt: string;
}

export interface CognitiveQueryResult {
  queryId: string;
  resultType: CognitiveQueryType;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  paths: CognitivePath[];
  confidenceLevel: 'DETERMINISTIC' | 'HEURISTIC' | 'PROBABILISTIC';
  generatedAt: string;
}
