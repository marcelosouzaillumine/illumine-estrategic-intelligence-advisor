// src/core/runtime/institutional-recovery/RecoveryTypes.ts

export type RecoveryStage =
  | 'RECOVERY_MONITORING'
  | 'RECOVERY_STAGE_1_PENDING'
  | 'RECOVERY_STAGE_1'
  | 'RECOVERY_STAGE_2'
  | 'RECOVERY_STAGE_3'
  | 'FULL_REAUTHORIZATION';

export interface InstitutionalRecoveryOutput {
  recoveryAuthorized: boolean;
  falseRecoveryDetected: boolean;
  activeRecoveryStage: RecoveryStage;
  institutionalRecoveryConfidence: 'LOW' | 'MODERATE' | 'HIGH';
  recoveryConsistencyScore: number;
  blockedReauthorizations: string[];
  allowedReauthorizations: string[];
  releasedConstraints: string[];
  remainingConstraints: string[];
  recoveryDrivers: string[];
  falseRecoveryDrivers: string[];
  longitudinalValidationStatus: 'INSUFFICIENT_HISTORY' | 'PARTIAL_VALIDATION' | 'LONGITUDINAL_VALIDATION_COMPLETE';
  treasuryRecoveryStatus: 'FRAGILE' | 'STABILIZING' | 'RESILIENT';
  patrimonialRecoveryStatus: 'ERODED' | 'STABILIZING' | 'RECOVERED';
  governanceRecoveryStatus: 'RESTRICTED' | 'PARTIALLY_RESTORED' | 'NORMALIZED';
  recoveryNarrative: string;
  auditTrail: string[];
  lineageHash: string;
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface RecoveryEvaluationInput {
  survivalReport?: any;
  fiduciaryOutput?: any;
  treasuryRuntime?: any;
  cashIntelligenceRuntime?: any;
  patrimonialIntelligenceRuntime?: any;
  longitudinalRuntimeHistory?: any[];
  historicalCycles?: any[];
  fco?: number;
  availableCash?: number;
  netIncome?: number;
  memoryProfile?: any;
  regressionReport?: any;
  resilienceReport?: any;
}
