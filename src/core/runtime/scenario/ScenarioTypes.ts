import { ConsolidatedFinancialInput } from '../consolidated/types';
import { ConsolidatedExecutiveAdvisoryReport } from '../consolidated/advisory/advisoryTypes';
import { GovernanceViolationRecord } from '../observability/observability-types';

export type ScenarioShockType = 
  | 'REVENUE_DROP'
  | 'LIQUIDITY_CRISIS'
  | 'INTEREST_RATE_SHOCK'
  | 'DEFAULT_EVENT'
  | 'SUBSIDIARY_COLLAPSE'
  | 'SUPPLY_CHAIN_DISRUPTION'
  | 'CURRENCY_STRESS'
  | 'INFLATION_PRESSURE'
  | 'COVENANT_BREAK'
  | 'WORKING_CAPITAL_COMPRESSION';

export interface ScenarioShock {
  type: ScenarioShockType;
  targetEntityId: string; // "GROUP_LEVEL" or specific entityId
  magnitude: number; // Percentual 0-1 ou multiplicador (ex: 0.15 para 15% de queda)
  description?: string;
}

export interface ScenarioSimulationInput {
  baseSnapshot: ConsolidatedFinancialInput;
  shocks: ScenarioShock[];
  horizonMonths: number;
  recoveryAuthorized?: boolean;
  isSurvivalMode?: boolean;
  regressionDetected?: boolean;
  resilienceClassification?: string;
}

export type ProjectedConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL_STRESS';

export interface InstitutionalStressResult {
  survivingEntities: string[];
  collapsedEntities: string[];
  groupSolvencyStatus: 'SOLVENT' | 'AT_RISK' | 'INSOLVENT';
  estimatedCashBurnRate: number;
  monthsToLiquidityCrisis: number;
}

export interface ScenarioPropagationResult {
  stressResult: InstitutionalStressResult;
  projectedConfidence: ProjectedConfidence;
  propagatedViolations: GovernanceViolationRecord[];
}

export interface ScenarioNarrative {
  executiveSummary: string;
  keyVulnerabilities: string[];
}

export interface ScenarioSimulationResult {
  scenarioId: string;
  executionId: string;
  groupId: string;
  timestamp: string;
  shocksApplied: ScenarioShock[];
  historicalConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  projectedConfidence: ProjectedConfidence;
  institutionalStress: InstitutionalStressResult;
  narrative: ScenarioNarrative;
  // Apenas metadados high-level. Não guarda o DRE/BP gigante modificado.
  runtimeVersion: string;
  snapshotHash: string; 
  fiduciarySeverity?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  fiduciaryViolation?: string;
  scenarioValidity?: 'VALID' | 'INVALID_SURVIVAL_CONFLICT' | 'INVALID_PREMATURE_RECOVERY' | 'INVALID_RECOVERY_REGRESSION' | 'INVALID_RESILIENCE_FRAGILITY';
}

export interface ScenarioExecutionRecord extends ScenarioSimulationResult {
  // A persistência inclui os metadados brutos 
}
