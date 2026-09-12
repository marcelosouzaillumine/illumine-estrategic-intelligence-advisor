export type WarningSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PredictiveConfidence = 'LOW' | 'MEDIUM' | 'HIGH';
export type DeteriorationCategory = 
  | 'LIQUIDITY_SUFFOCATION' 
  | 'WORKFLOW_FAILURE' 
  | 'GOVERNANCE_COLLAPSE' 
  | 'BENCHMARK_DEVIATION' 
  | 'SYSTEMIC_RISK'
  | 'CONFIDENCE_DRIFT';

export interface WarningLineageReference {
  executionId: string;
  sourceAlertIds?: string[];
  workflowIds?: string[];
  scenarioIds?: string[];
  graphPatternIds?: string[];
  lineageHash: string;
}

export interface WarningEvidence {
  evidenceId: string;
  tenantId: string;
  description: string;
  timestamp: string;
  lineage: WarningLineageReference;
}

export interface EarlyWarningSignal {
  signalId: string;
  tenantId: string;
  category: DeteriorationCategory;
  severity: WarningSeverity;
  predictiveConfidence: PredictiveConfidence;
  title: string;
  description: string;
  evidence: WarningEvidence;
  createdAt: string;
}

export interface PredictiveRiskEvent {
  eventId: string;
  tenantId: string;
  trend: 'STABLE' | 'WORSENING' | 'IMPROVING';
  relatedSignals: EarlyWarningSignal[];
  timestamp: string;
}

export interface RiskSignal {
  source: string;
  value: number; // 0 to 1
  metadata: Record<string, unknown>;
}

export interface DeteriorationPattern {
  patternId: string;
  category: DeteriorationCategory;
  frequency: number;
  lastObserved: string;
}

export interface GovernanceRiskTrend {
  trendId: string;
  tenantId: string;
  currentScore: number;
  historicalScores: number[];
  trendDirection: 'WORSENING' | 'STABLE' | 'IMPROVING';
}

export interface EarlyWarningExecution {
  executionId: string;
  tenantId: string;
  signalsGenerated: number;
  executionTimeMs: number;
  timestamp: string;
}

export interface RiskEscalationSignal {
  escalationId: string;
  signalId: string;
  escalatedTo: string;
  timestamp: string;
}
