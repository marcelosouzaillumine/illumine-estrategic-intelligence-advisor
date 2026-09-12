// src/core/runtime/treasury-intelligence/types.ts

import { RuntimeOutputBase, RuntimeSeverity } from '../../../core/runtime/shared/runtime-contracts';
import { TreasuryLineageHash } from '../../../core/runtime/shared/lineage-types';

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
  reserveDegradationVelocity: number; 
  dependencyRecurrenceIntensity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  exhaustionProjected: boolean;
}

export interface CashPriorityOutput {
  escalatedPriorityList: string[];
  payrollPriorityScore: number; 
  criticalCapexPriorityScore: number; 
  reserveProtectionPriorityScore: number; 
}

export interface TreasuryStressOutput {
  stressSeverity: RuntimeSeverity;
  cumulativeExhaustionDays: number;
  activeStressFactors: string[];
  simulatedExhaustionProjected: boolean;
}

export interface CapitalPreservationOutput {
  preservationScore: number; 
  preservationDiscipline: 'HIGH' | 'MODERATE' | 'LOW' | 'DEVIATING';
  reserveErosionVelocity: number;
}

export interface TreasuryIntelligenceRuntimeOutput extends RuntimeOutputBase {
  isAvailable: boolean;
  severity: RuntimeSeverity;
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
  
  // Specific legacy fields removed/mapped:
  // fiduciaryDisclosures -> now in RuntimeOutputBase.disclosures
  // auditTrail -> RuntimeOutputBase.lineage
  // treasuryLineageHash -> RuntimeOutputBase.lineage.lineageHash
}
