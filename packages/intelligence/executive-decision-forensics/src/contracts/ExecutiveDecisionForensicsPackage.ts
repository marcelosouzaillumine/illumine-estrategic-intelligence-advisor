export interface IdentityContext {
  tenantId: string;
  userId: string;
  roles: string[];
  sessionToken: string;
}

export interface Observation {
  id: string;
  timestamp: Date;
  source: string;
  data: any;
}

export interface Evidence {
  id: string;
  timestamp: Date;
  referenceId: string;
  content: string;
  confidence: number;
}

export interface ReasoningStep {
  id: string;
  stepNumber: number;
  description: string;
  appliedLogic: string;
}

export interface AgentContribution {
  agentId: string;
  agentRole: string;
  contribution: string;
  confidence: number;
}

export interface ConfidenceSnapshot {
  timestamp: Date;
  stage: string;
  score: number;
  factors: string[];
}

export interface GovernanceDecision {
  status: 'APPROVED' | 'REQUIRES_HUMAN_REVIEW' | 'BLOCKED' | 'OPAQUE_INTELLIGENCE';
  gateId: string;
  timestamp: Date;
  reason?: string;
}

export interface ExecutiveRecommendation {
  id: string;
  title: string;
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionableSteps: string[];
}

export interface OutcomeLearning {
  id: string;
  timestamp: Date;
  expectedOutcome: string;
  actualOutcome: string;
  deltaAnalysis: string;
}

export interface LineageMetadata {
  lineageId: string;
  version: string;
  timestamp: Date;
  parentReference?: string;
  evidenceReference?: string;
}

export interface ExecutiveDecisionForensicsPackage {
  decisionId: string;
  tenantId: string;
  lineage: LineageMetadata;
  identityContext: IdentityContext;
  observationChain: Observation[];
  evidenceChain: Evidence[];
  reasoningChain: ReasoningStep[];
  agentContributions: AgentContribution[];
  confidenceEvolution: ConfidenceSnapshot[];
  governanceValidation: GovernanceDecision;
  recommendation: ExecutiveRecommendation;
  outcomeLearning?: OutcomeLearning;
}
