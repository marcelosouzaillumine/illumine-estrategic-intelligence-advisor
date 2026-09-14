export type DecisionCategory = 'DIVESTMENT' | 'CAPEX_EXPANSION' | 'M_A' | 'RESTRUCTURING' | 'DEBT_REFINANCING';

export interface DecisionLineageReference {
  executionId: string;
  workflowIds?: string[];
  alertIds?: string[];
  scenarioIds?: string[];
  benchmarkRefs?: string[];
  graphPatternRefs?: string[];
  decisionIds?: string[];
  lineageHash: string;
  timestamp: string;
}

export interface DecisionEvidence {
  evidenceId: string;
  tenantId: string;
  description: string;
  lineage: DecisionLineageReference;
}

export interface StrategicDecision {
  decisionId: string;
  tenantId: string;
  category: DecisionCategory;
  title: string;
  description: string;
  evidence: DecisionEvidence;
}

export interface StrategicSimulationInput {
  simulationId: string;
  tenantId: string;
  decision: StrategicDecision;
  timeframeMonths: number;
}

export interface DecisionImpactProjection {
  impactId: string;
  domain: 'LIQUIDITY' | 'GOVERNANCE' | 'SYSTEMIC_EXPOSURE' | 'OPERATIONAL';
  delta: number; // -1 to +1
  description: string;
}

export interface GovernanceTradeoff {
  tradeoffId: string;
  gainDomain: string;
  gainDescription: string;
  lossDomain: string;
  lossDescription: string;
  netResilienceImpact: number;
}

export interface InstitutionalConsequence {
  consequenceId: string;
  targetEntityId: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface StrategicRiskProjection {
  riskId: string;
  description: string;
  probability: number; // 0 to 1
  impact: number; // 0 to 1
}

export interface ResilienceProjection {
  tenantId: string;
  preDecisionScore: number;
  postDecisionScore: number;
  recoveryTimeMonths: number;
}

export interface StrategicSimulationResult {
  simulationId: string;
  tenantId: string;
  input: StrategicSimulationInput;
  impacts: DecisionImpactProjection[];
  tradeoffs: GovernanceTradeoff[];
  consequences: InstitutionalConsequence[];
  risks: StrategicRiskProjection[];
  resilience: ResilienceProjection;
  lineageHash: string;
  timestamp: string;
}

export interface ScenarioComparison {
  comparisonId: string;
  tenantId: string;
  baseScenarioId: string;
  alternativeScenarioId: string;
  resilienceDelta: number;
  liquidityDelta: number;
  governanceDelta: number;
}

export interface StrategicSimulationExecution {
  executionId: string;
  tenantId: string;
  simulationsRun: number;
  timestamp: string;
}
