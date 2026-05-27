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
}

export interface HistoricalCycleData {
  year: number;
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
}
