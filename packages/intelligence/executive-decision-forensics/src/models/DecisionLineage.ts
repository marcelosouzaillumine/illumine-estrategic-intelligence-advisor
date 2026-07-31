export type CognitiveNodeId = string;

export interface DecisionLineageNode {
  id: CognitiveNodeId;
  parentId?: CognitiveNodeId;
  type: 'OBSERVATION' | 'EVIDENCE' | 'REASONING' | 'RECOMMENDATION' | 'DECISION';
  timestamp: string;
}

export interface ObservationNode extends DecisionLineageNode {
  type: 'OBSERVATION';
  description: string;
  source: string;
}

export interface EvidenceNode extends DecisionLineageNode {
  type: 'EVIDENCE';
  dataPoint: string;
  confidence: number;
}

export interface ReasoningNode extends DecisionLineageNode {
  type: 'REASONING';
  logicApplied: string;
  alternativesDiscarded: string[];
}

export interface RecommendationNode extends DecisionLineageNode {
  type: 'RECOMMENDATION';
  suggestion: string;
  impactScore: number;
}

export interface DecisionOutcomeNode extends DecisionLineageNode {
  type: 'DECISION';
  humanOutcome: 'ACCEPTED' | 'REJECTED' | 'MODIFIED';
  reason?: string;
}
