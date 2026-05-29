// src/core/runtime/treasury-intelligence/types.ts

export type TreasurySeverity =
  | 'STABLE'
  | 'SENSITIVE'
  | 'STRESSED'
  | 'CRITICAL'
  | 'UNSUSTAINABLE'
  | 'TREASURY_RUPTURE_RISK';

export type TreasuryPriorityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface TreasuryAllocationItem {
  id: string;
  category: string;
  amount: number;
  priority: TreasuryPriorityLevel;
  status: 'APPROVED' | 'DEGRADED' | 'FROZEN';
  rationale: string;
}

export interface DistributionSustainabilityOutput {
  eligible: boolean;
  accountingDistributable: number;
  fiduciaryDistributable: number;
  isBlocked: boolean;
  blockedReasons: string[];
  patrimonialErosionIndex: number; // 0 a 100
}

export interface ReinvestmentIntelligenceOutput {
  reinvestmentQuality: 'HIGH' | 'MODERATE' | 'LOW' | 'FRAGILE';
  operationalReturnSustainability: number; // 0 a 100
  compatibilityWithSurvivability: boolean;
  warnings: string[];
}

export interface FiduciaryEfficiencyOutput {
  efficiencyScore: number; // 0 a 100
  survivabilityAdjustedEfficiency: number; // 0 a 100
  silentCashDestructionDetected: boolean;
  inefficientAllocationPatterns: string[];
}

export interface TreasuryResilienceOutput {
  reserveSustainabilityDays: number;
  liquidityRedundancyRatio: number;
  resilienceHalfLifeDays: number;
  reserveDegradationVelocity: number; // queima diária/mensal
  dependencyRecurrenceIntensity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  exhaustionProjected: boolean;
}

export interface CashPriorityOutput {
  escalatedPriorityList: string[];
  payrollPriorityScore: number; // 0 a 100
  criticalCapexPriorityScore: number; // 0 a 100
  reserveProtectionPriorityScore: number; // 0 a 100
}

export interface TreasuryStressOutput {
  stressSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cumulativeExhaustionDays: number;
  activeStressFactors: string[];
  simulatedExhaustionProjected: boolean;
}

export interface CapitalPreservationOutput {
  preservationScore: number; // 0 a 100
  preservationDiscipline: 'HIGH' | 'MODERATE' | 'LOW' | 'DEVIATING';
  reserveErosionVelocity: number;
}

export interface TreasuryIntelligenceRuntimeOutput {
  isAvailable: boolean;
  severity: TreasurySeverity;
  governanceVerdict: string;
  priorityMatrix: {
    priorities: TreasuryAllocationItem[];
    restrictedLayers: string[];
    activeCascadeBlock: boolean;
  };
  distributionSustainability: DistributionSustainabilityOutput;
  reinvestmentIntelligence: ReinvestmentIntelligenceOutput;
  fiduciaryEfficiency: FiduciaryEfficiencyOutput;
  treasuryResilience: TreasuryResilienceOutput;
  cashPriority: CashPriorityOutput;
  stressSimulations: TreasuryStressOutput;
  capitalPreservation: CapitalPreservationOutput;
  treasuryLineageHash: string;
  fiduciaryDisclosures: string[];
  auditTrail: string[];
}
