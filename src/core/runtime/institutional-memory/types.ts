export type InstitutionalPatternType =
  | 'LIQUIDITY_DETERIORATION'
  | 'OPERATIONAL_CONTAGION'
  | 'MARGIN_PRESSURE'
  | 'CASH_FLOW_STRESS'
  | 'GOVERNANCE_BREACH'
  | 'EXECUTION_FAILURE'
  | 'RECURRING_ALERT'
  | 'FIDUCIARY_ESCALATION'
  | 'CROSS_ENTITY_DEPENDENCY'
  | 'STRATEGIC_DRIFT';

export type InstitutionalRecurrenceLevel = 'ISOLATED' | 'OCCASIONAL' | 'RECURRING' | 'CHRONIC' | 'SYSTEMIC';

export type InstitutionalMemoryIntegrity = 'VERIFIED' | 'PARTIAL' | 'DEGRADED' | 'FAIL_CLOSED';

export type InstitutionalHistoricalConfidence = 'LOW' | 'MODERATE' | 'HIGH' | 'VERIFIED';

export type MemorySourceType = 'DEMO' | 'RUNTIME' | 'IMPORTED';

export interface InstitutionalMemoryRecord {
  memoryId: string;
  tenantId: string;
  entityId: string;
  actorId?: string;
  correlationId?: string;
  lineageReference?: string;
  timestamp: string;
  runtimeReferenceId: string;
  lineageHash: string;
  governanceCategory: string;
  severityLevel: string;
  executiveUrgency: string;
  narrativeSnapshot: string;
  causalSummary: string;
  recommendationSnapshot: string[];
  confidenceSnapshot: string;
  memorySource: MemorySourceType;
  integrityStatus: InstitutionalMemoryIntegrity;
}

export interface PatternSignal {
  patternType: InstitutionalPatternType;
  recurrence: InstitutionalRecurrenceLevel;
  frequencyCount: number;
  firstDetected: string;
  lastDetected: string;
  evidenceRecordIds: string[];
}

export interface RecommendationContinuity {
  recommendationText: string;
  timesIssued: number;
  firstIssuedAt: string;
  lastIssuedAt: string;
  originatingLineages: string[];
  unresolved: boolean;
}

export interface HistoricalDecisionEntry {
  decisionId: string;
  timestamp: string;
  decisionType: string;
  approvalState: string;
  lineageHash: string;
  actorId?: string;
  role?: string;
  tenantId?: string;
  correlationId?: string;
  lineageReference?: string;
}

export interface HistoricalReplayIndexEntry {
  replayId: string;
  tenantId: string;
  entityScope: string;
  lineageHash: string;
  inputHash: string;
  advisoryHash: string;
  simulationHash?: string;
  workflowHash?: string;
  correlationId: string;
  timestamp: string;
  period: string;
  maturityScore: number;
  governanceConsistencyIndex: number;
  resilienceTrend: string;
  deteriorationTrend: string;
  anomalyReferences: string[];
  recommendationReferences: string[];
  retentionLayer: 'HOT' | 'WARM' | 'COLD';
  visibilityPolicy: string;
}

export interface LongitudinalMaturityProfile {
  maturityScore: number;
  maturityTrend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  deteriorationTrend: number;
  resilienceTrend: number;
  governanceConsistencyIndex: number;
}

export interface InstitutionalLearningSignals {
  advisoryAdherenceScore: number;
  governanceFatigueScore: number;
  executiveResponsivenessScore: number;
  structuralResilienceScore: number;
  operationalPersistenceScore: number;
}

export interface HistoricalCycleData {
  year: number;
  tenantId?: string;
  correlationId?: string;
  confidenceLevel?: string;
  violations?: Array<{
    violationId: string;
    severity: string;
    message: string;
    sourceContext: string;
  }>;
  recommendations?: string[];
  decisions?: HistoricalDecisionEntry[];
  lineageHash?: string;
  bpData?: any[];
  scores?: {
    composite: number;
    financial?: number;
    operational?: number;
    governance?: number;
    structural?: number;
  };
}

export interface InstitutionalMemoryProfile {
  recurrencePatterns: string[];
  ignoredRecommendations: string[];
  governanceHistory: Array<{
    timestamp: string;
    eventType: string;
    description: string;
  }>;
  deteriorationSignals: string[];
  operationalRecurrence: string[];
  decisionPatterns: string[];
  confidenceEvolution: Array<{
    period: number | string;
    dataConfidence: string;
    strategicConfidence: string;
  }>;
  institutionalTimeline: Array<{
    period: number | string;
    events: string[];
  }>;
  structuralPersistence: string[];
  recurrenceSeverity: 'LOW_RECURRENCE' | 'MODERATE_RECURRENCE' | 'HIGH_RECURRENCE' | 'CRITICAL_STRUCTURAL_RECURRENCE';
  evidenceIntegrityHash: string;
  memoryLineageHash: string;
  recurrenceConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
  historicalDensityRequirement: 'INSUFFICIENT' | 'SUFFICIENT';
  maturityProfile?: LongitudinalMaturityProfile;
  learningSignals?: InstitutionalLearningSignals;
}

export interface DeteriorationState {
  deteriorationScore: number;
  deteriorationVelocity: number;
  deteriorationSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  deteriorationPersistence: number;
  institutionalRiskLevel: 'STABLE' | 'ELEVATED' | 'SEVERE' | 'INSUFFICIENT_HISTORY';
}

export interface FatigueState {
  fatigueScore: number;
  fatigueTrend: 'DECREASING' | 'STABLE' | 'INCREASING';
  governanceExhaustionLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  operationalPressureLevel: 'NORMAL' | 'ELEVATED' | 'SEVERE';
}

export interface ResponsivenessMetrics {
  responsivenessScore: number;
  governanceReactionTime: number; // in days or cycles
  advisoryExecutionRate: number; // percentage
  executionDisciplineIndex: number;
  workflowCompletionSpeed: number; // percentage or index
}

export interface PredictiveRecurrenceState {
  recurrenceScore: number;
  recurrenceFrequency: number;
  recurrenceSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_STRUCTURAL_RECURRENCE' | 'INSUFFICIENT_RECURRENCE';
  recurrenceConfidence: 'UNVERIFIED' | 'LOW' | 'MODERATE' | 'HIGH';
  recurrenceLineage: string[];
}

export type EscalationLevel = 'MONITOR' | 'MANAGEMENT_ACTION' | 'CFO_INTERVENTION' | 'BOARD_INTERVENTION' | 'CRITICAL_GOVERNANCE_REVIEW';

export interface TemporalEscalationState {
  currentLevel: EscalationLevel;
  escalationEvidence: string[];
  recurrenceLineage: string[];
  severityProgression: EscalationLevel[];
  auditReference: string;
}

export interface TemporalEvidence {
  timestamp: string;
  evidenceId: string;
  sourceContext: string;
  description: string;
}

export interface TemporalConfidenceState {
  level: 'UNVERIFIED' | 'LOW' | 'MODERATE' | 'HIGH';
  justification: string;
}

export interface CausalChain {
  chainId: string;
  links: string[];
  rootCauseId?: string;
}

export interface TemporalLineage {
  lineageHash: string;
  correlationId: string;
  tenantId: string;
  originTimestamp: string;
}

export interface TemporalGovernanceScore {
  temporalGovernanceScore: number;
  governanceTrajectory: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  institutionalStabilityIndex: number;
  recurrenceSeverityWeight: number;
  responsivenessWeight: number;
  fatigueWeight: number;
  deteriorationWeight: number;
  resilienceWeight: number;
}

export type EarlyWarningType = 
  | 'RUNWAY_COLLAPSE_TENDENCY' 
  | 'GOVERNANCE_BREAKDOWN_TENDENCY' 
  | 'ANOMALY_ESCALATION_PATTERN' 
  | 'FATIGUE_THRESHOLD_BREACH' 
  | 'OPERATIONAL_COLLAPSE_PRECURSOR' 
  | 'ADVISORY_NEGLECT_ESCALATION';

export interface EarlyWarningSignal {
  warningType: EarlyWarningType;
  description: string;
  recurrenceCycles: number;
  lineageHash: string;
  auditReference: string;
}

export interface TemporalCausalityOutput {
  temporalGovernanceScore: TemporalGovernanceScore;
  earlyWarnings: EarlyWarningSignal[];
  deteriorationState: DeteriorationState;
  responsivenessMetrics: ResponsivenessMetrics;
  fatigueState: FatigueState;
  predictiveRecurrence: PredictiveRecurrenceState;
  escalationState: TemporalEscalationState;
  causalChain: CausalChain;
  lineageHash: string;
  correlationId: string;
  tenantId: string;
  entityScope: string;
  temporalEvidence: TemporalEvidence[];
  confidenceState: TemporalConfidenceState;
  auditReference: string;
}
