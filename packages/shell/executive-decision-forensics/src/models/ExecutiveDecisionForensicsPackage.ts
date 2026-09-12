import { 
  ObservationNode, 
  EvidenceNode, 
  ReasoningNode, 
  RecommendationNode, 
  DecisionOutcomeNode 
} from './DecisionLineage';

export interface AgentContribution {
  agentId: string;
  role: string;
  inputProvided: string;
  timestamp: string;
}

export interface ConfidenceSnapshot {
  timestamp: string;
  score: number;
  factors: string[];
}

export interface GovernanceValidation {
  ruleId: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  timestamp: string;
  details: string;
}

export interface OutcomeLearning {
  learningId: string;
  patternMatched: boolean;
  adjustmentsNeeded: string[];
}

export interface ExecutiveIdentityForensic {
  tenantId: string;
  userId: string;
  role: string;
  sessionTokenHash: string;
}

export interface ExecutiveDecisionForensicsPackage {
  decisionId: string;
  tenantId: string;
  initiatedBy: ExecutiveIdentityForensic;
  
  observationChain: ObservationNode[];
  evidenceChain: EvidenceNode[];
  reasoningChain: ReasoningNode[];
  
  agentContributions: AgentContribution[];
  confidenceEvolution: ConfidenceSnapshot[];
  governanceChecks: GovernanceValidation[];
  
  finalRecommendation: RecommendationNode;
  humanDecision?: DecisionOutcomeNode;
  learningFeedback?: OutcomeLearning;
}
