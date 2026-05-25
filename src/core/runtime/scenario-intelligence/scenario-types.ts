import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { MasterCausalOutput } from '../../../lib/master-causal-engine';
import { SystemicRisk } from '../consolidated/advisory/advisoryTypes';

export type ScenarioType = 
  | 'SUSTAINABLE_GROWTH'
  | 'DESTRUCTIVE_GROWTH'
  | 'TREASURY_STRESS'
  | 'RUNWAY_COLLAPSE'
  | 'CAPITAL_DEPENDENCY'
  | 'OPERATIONAL_RETRACTION'
  | 'OPERATIONAL_RECOVERY'
  | 'AGGRESSIVE_EXPANSION'
  | 'SLOW_DETERIORATION'
  | 'MARGIN_SHOCK'
  | 'CASH_COMPRESSION'
  | 'WORKING_CAPITAL_DETERIORATION';

export interface ScenarioParameter {
  revenueShock?: number;       // e.g. 1.2 (+20%)
  marginShock?: number;        // e.g. 0.8 (-20%)
  opexExpansion?: number;      // e.g. 1.5 (+50%)
  capexInvestment?: number;    // Absolute value
  capitalInjection?: number;   // Equity/Debt injection
  debtInjection?: number;      // Debt injection
  receivablesDaysExtension?: number; // Days
  payablesDaysExtension?: number;    // Days
  headcountAddition?: number;  // Absolute cost
}

export interface ScenarioConfidence {
  baseConfidenceScore: number;       // 0-100
  timeDecayFactor: number;           // Penalty for long projections
  uncertaintyMargin: number;         // Uncertainty derived from shock magnitude
  volatilityWeight: number;          // Business model volatility
  historicalConsistencyScore: number;// Consistency with past 5 periods
  finalConfidence: number;           // Output confidence
}

export interface BaseSnapshot {
  timestamp: string;
  // A simplified snapshot of base financial indicators for delta comparisons
  baseEbitda: number;
  baseRunway: number;
  baseCash: number;
  baseDebt: number;
  baseLiquidity: number;
}

export interface ProjectedSnapshot {
  // A full cloned and mutated ExecutiveReport
  projectedReport: ExecutiveIntelligenceReport;
}

export interface DeltaAnalysis {
  ebitdaDelta: number;
  runwayDelta: number;
  cashDelta: number;
  liquidityDelta: number;
  debtDelta: number;
  isDestructive: boolean;
  deltaSummary: string;
}

export interface ScenarioRisks {
  identifiedRisks: string[];
  systemicRisks?: SystemicRisk[];
}

export interface ScenarioExecutiveSummary {
  scenarioName: string;
  scenarioType: ScenarioType;
  hypothesis: string;
  conclusion: string;
  recommendedAction: string;
}

export interface ScenarioSimulationInput {
  baseReport: ExecutiveIntelligenceReport; // To be deprecated? Wait, the Orchestrator runs from RAW inputs.
  // Actually, the rules say: "Base Historical State -> Safe Clone -> Scenario Mutations -> Rebuild Runtime Input -> RuntimeOrchestrator"
  // So the input should probably be the historical series or the RuntimeInput, not the ExecutiveReport.
  // We'll define RuntimeInput representation here temporarily as any.
  rawInput: any; 
  scenarioType: ScenarioType;
  parameters: ScenarioParameter;
  projectionMonths: number;
}

export interface ScenarioOutput {
  id: string;
  type: ScenarioType;
  baseSnapshot: BaseSnapshot;
  projectedSnapshot: ProjectedSnapshot;
  deltaAnalysis: DeltaAnalysis;
  scenarioCausality: MasterCausalOutput; // Extracted or generated from the projected data
  scenarioRisks: ScenarioRisks;
  executiveSummary: ScenarioExecutiveSummary;
  confidence: ScenarioConfidence;
}
