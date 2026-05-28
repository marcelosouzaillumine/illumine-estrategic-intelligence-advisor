export type SimulationScenarioType =
  | 'LIQUIDITY_STRESS'
  | 'OPERATIONAL_COLLAPSE'
  | 'MARGIN_DETERIORATION'
  | 'CASH_FLOW_CONTRACTION'
  | 'GOVERNANCE_BREAKDOWN'
  | 'FIDUCIARY_ESCALATION'
  | 'SUPPLIER_DEPENDENCY'
  | 'MULTI_ENTITY_CONTAGION'
  | 'STRATEGIC_DRIFT'
  | 'EXECUTION_FAILURE';

export type SimulationConfidenceLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'VERIFIED'
  | 'INSUFFICIENT_HISTORY';

export type SimulationPropagationSeverity =
  | 'CONTAINED'
  | 'ELEVATED'
  | 'CRITICAL'
  | 'SYSTEMIC';

export type SimulationTimeHorizon =
  | '30_DAYS'
  | '90_DAYS'
  | '180_DAYS'
  | '365_DAYS';

export type SimulationIntegrityState =
  | 'VERIFIED'
  | 'DEGRADED'
  | 'FAIL_CLOSED';

export type StrategicStressLevel =
  | 'LIGHT'
  | 'MODERATE'
  | 'HIGH'
  | 'EXTREME';

export interface SimulationInput {
  scenarioType: SimulationScenarioType;
  horizon: SimulationTimeHorizon;
  tenantId: string;
  entityId: string;
  baseFinancials: {
    ativoTotal?: number;
    ativoCirculante?: number;
    passivoCirculante?: number;
    passivoTotal?: number;
    patrimonioLiquido?: number;
    caixaEquivalentes?: number;
    estoques?: number;
    receitaBruta?: number;
    receitaLiquida?: number;
    custosVar?: number;
    despesasFixas?: number;
    ebitda?: number;
    lucroLiquido?: number;
  };
  historicalCycles: Array<{
    period: string;
    maturityScore: number;
    anomaliesCount: number;
    violationsCount: number;
    cashValue: number;
    netMargin: number;
    lineageHash: string;
  }>;
  activeEscalationLevel: string; // From TemporalEscalationState
  lineageHash: string;
  correlationId: string;
}

export interface SimulationOutput {
  tenantId: string;
  correlationId: string;
  lineageHash: string;
  sourceRuntimeReferences: string[];
  confidenceLevel: SimulationConfidenceLevel;
  integrityState: SimulationIntegrityState;
  generatedAt: string;
  scenarioType: SimulationScenarioType;
  horizon: SimulationTimeHorizon;
  projectedDeterioration: {
    score: number; // 0-100
    velocity: number; // rate of change per cycle
    description: string;
  };
  projectedEscalation: {
    targetLevel: string; // Monitor, Management Action, CFO, Board
    trajectory: string[]; // sequence of escalation steps
    deterministicRiskBand: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';
  };
  exposureProgression: {
    level: string; // Low, Medium, High, Extreme
    description: string;
  };
  stressClassification: StrategicStressLevel;
  propagationChain: Array<{
    step: number;
    entityId: string;
    contagionType: string;
    impactDescription: string;
    severity: SimulationPropagationSeverity;
  }>;
  assumptions: string[];
  limitations: string[];
  dependencies: string[];
  historicalBasisIds: string[];
}

export interface SandboxConfig {
  actionType:
    | 'HIRING_FREEZE'
    | 'DEBT_INCREASE'
    | 'SUPPLIER_CONCENTRATION'
    | 'RESTRUCTURING'
    | 'EXPANSION'
    | 'OPERATIONAL_CONTRACTION';
  intensity: number; // 0.0 - 1.0 modifier
}

export interface SandboxResult {
  isSandbox: true;
  appliedActions: SandboxConfig[];
  originalOutput: SimulationOutput;
  simulatedOutput: SimulationOutput;
  stressDelta: number; // difference in stress scores
  generatedAt: string;
}
