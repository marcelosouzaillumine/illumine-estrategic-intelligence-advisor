export interface OrchestrationLineageReference {
  executionId: string;
  workflowIds?: string[];
  alertIds?: string[];
  simulationIds?: string[];
  benchmarkRefs?: string[];
  graphRefs?: string[];
  governanceContext: string;
  lineageHash: string;
  timestamp: string;
}

export interface RecommendationEvidence {
  evidenceId: string;
  tenantId: string;
  rationale: string;
  lineage: OrchestrationLineageReference;
}

export interface GovernancePlaybook {
  playbookId: string;
  name: string;
  description: string;
  tenantScope: string;
  activationThresholds: string[];
  escalationRules: string[];
  supervisionRequirement: 'BOARD_ONLY' | 'EXECUTIVE' | 'HYBRID';
}

export interface InstitutionalRecommendation {
  recommendationId: string;
  tenantId: string;
  playbookId: string;
  title: string;
  description: string;
  evidence: RecommendationEvidence;
  status: 'PENDING_SUPERVISION' | 'REJECTED' | 'ACKNOWLEDGED';
}

export interface GovernanceActionPlan {
  planId: string;
  recommendationId: string;
  actions: string[];
  timelineMonths: number;
}

export interface InstitutionalPriority {
  priorityId: string;
  domain: string;
  action: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
}

export interface EscalationSequence {
  sequenceId: string;
  steps: string[];
  targetAudience: string;
}

export interface RecoveryStrategy {
  strategyId: string;
  domain: string;
  containmentAction: string;
  recoveryTimelineMonths: number;
}

export interface CrossDomainImpact {
  impactId: string;
  sourceDomain: string;
  targetDomain: string;
  description: string;
}

export interface OperationalRecoveryProjection {
  projectionId: string;
  bottleneck: string;
  mitigation: string;
}

export interface PlaybookExecutionProjection {
  projectionId: string;
  playbookId: string;
  expectedStabilizationTime: number;
  tradeoffs: string[];
}

export interface StrategicResponse {
  responseId: string;
  domain: string;
  action: string;
}

export interface GovernanceCoordinationResult {
  coordinationId: string;
  tenantId: string;
  playbook: GovernancePlaybook;
  recommendation: InstitutionalRecommendation;
  plan: GovernanceActionPlan;
  priorities: InstitutionalPriority[];
  escalation: EscalationSequence;
  recovery: RecoveryStrategy[];
  crossDomain: CrossDomainImpact[];
  operational: OperationalRecoveryProjection[];
  projection: PlaybookExecutionProjection;
  responses: StrategicResponse[];
  timestamp: string;
}
