// src/core/runtime/recovery-regression/RecoveryRegressionTypes.ts

export interface RecoveryRegressionOutput {
  regressionDetected: boolean;
  relapseDetected: boolean;
  previousRecoveryStage: string;
  currentRecoveryStage: string;
  survivalModeReactivated: boolean;
  recoveryStabilityScore: number;
  regressionSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  regressionDrivers: string[];
  relapseDrivers: string[];
  reactivatedConstraints: string[];
  removedAuthorizations: string[];
  treasuryRegressionStatus: 'STABLE' | 'PRESSURED' | 'CRITICAL';
  patrimonialRegressionStatus: 'STABLE' | 'ERODING' | 'SEVERELY_ERODED';
  continuityRegressionStatus: 'STABLE' | 'FRAGILE' | 'CRITICAL';
  narrativeDowngrades: string[];
  recoveryNarrativeAdjustment: string;
  failClosedTriggered: boolean;
  auditTrail: string[];
  lineageHash: string;
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface RegressionEvaluationInput {
  recoveryReport?: any;
  survivalReport?: any;
  fiduciaryOutput?: any;
  treasuryRuntime?: any;
  cashIntelligenceRuntime?: any;
  patrimonialIntelligenceRuntime?: any;
  liquidityStressRuntime?: any;
  longitudinalRuntimeHistory?: any[];
  operationalContinuityRuntime?: any;
  governanceTrajectoryRuntime?: any;
  fco?: number;
  availableCash?: number;
  historicalCycles?: any[];
  netIncome?: number;
  memoryProfile?: any;
  resilienceReport?: any;
}
