// src/core/runtime/institutional-survival/SurvivalTypes.ts

export type ActiveSurvivalMode =
  | 'SURVIVAL_MODE'
  | 'STABILIZATION_MODE'
  | 'RESILIENCE_MODE'
  | 'CONTROLLED_GROWTH_MODE'
  | 'SHAREHOLDER_OPTIMIZATION_MODE';

export interface InstitutionalSurvivalOutput {
  activeSurvivalMode: ActiveSurvivalMode;
  currentHierarchyLevel: number;
  blockedHierarchyLevels: string[];
  allowedInstitutionalPriorities: string[];
  forbiddenInstitutionalPriorities: string[];
  institutionalConstraints: string[];
  arbitrationDecisions: string[];
  treasuryProtectionLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  institutionalContinuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  causalDrivers: string[];
  survivalNarrative: string;
  failClosedTriggered: boolean;
  auditTrail: string[];
  lineageHash: string;
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface SurvivalEvaluationInput {
  fiduciaryOutput?: any;
  treasuryRuntime?: any;
  cashIntelligenceRuntime?: any;
  patrimonialIntelligenceRuntime?: any;
  recoveryReport?: any;
  historicalCycles?: any[];
  historicalCyclesCount?: number;
  availableCash?: number;
  fco?: number;
  netIncome?: number;
  memoryProfile?: any;
  regressionReport?: any;
  resilienceReport?: any;
}
