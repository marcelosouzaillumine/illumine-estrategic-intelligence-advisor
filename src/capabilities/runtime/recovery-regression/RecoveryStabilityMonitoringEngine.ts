// src/core/runtime/recovery-regression/RecoveryStabilityMonitoringEngine.ts

import { RegressionEvaluationInput } from './RecoveryRegressionTypes';

export interface StabilityMonitoringResult {
  recoveryStabilityScore: number;
  stabilityClassification: 'FULLY_STABLE' | 'STABLE_WITH_MONITORING' | 'FRAGILE_RECOVERY' | 'REGRESSION_RISK' | 'RECOVERY_COLLAPSE';
  treasuryRegressionStatus: 'STABLE' | 'PRESSURED' | 'CRITICAL';
  patrimonialRegressionStatus: 'STABLE' | 'ERODING' | 'SEVERELY_ERODED';
  continuityRegressionStatus: 'STABLE' | 'FRAGILE' | 'CRITICAL';
}

export class RecoveryStabilityMonitoringEngine {
  public static monitor(input: RegressionEvaluationInput): StabilityMonitoringResult {
    let score = 100;

    const fco = input.fco ?? 0;
    const runway = input.cashIntelligenceRuntime?.continuityRisk?.projectedRunwayMonths ?? 12;
    const isTreasuryStressed = input.treasuryRuntime?.severity === 'CRITICAL' || input.treasuryRuntime?.severity === 'HIGH';
    const patrimonialStatus = input.fiduciaryOutput?.patrimonialIntegrityStatus;

    // Evaluate Treasury Regression Status
    let treasuryRegressionStatus: 'STABLE' | 'PRESSURED' | 'CRITICAL' = 'STABLE';
    if (runway < 3 || isTreasuryStressed) {
      treasuryRegressionStatus = 'CRITICAL';
      score -= 40;
    } else if (runway < 6) {
      treasuryRegressionStatus = 'PRESSURED';
      score -= 20;
    }

    // Evaluate Patrimonial Regression Status
    let patrimonialRegressionStatus: 'STABLE' | 'ERODING' | 'SEVERELY_ERODED' = 'STABLE';
    if (patrimonialStatus === 'SEVERELY_ERODED' || patrimonialStatus === 'CAPITAL_COLLAPSE_RISK') {
      patrimonialRegressionStatus = 'SEVERELY_ERODED';
      score -= 40;
    } else if (patrimonialStatus === 'PRESSURED' || patrimonialStatus === 'ERODED') {
      patrimonialRegressionStatus = 'ERODING';
      score -= 20;
    }

    // Evaluate Continuity Regression Status
    let continuityRegressionStatus: 'STABLE' | 'FRAGILE' | 'CRITICAL' = 'STABLE';
    if (fco < 0) {
      continuityRegressionStatus = 'CRITICAL';
      score -= 40;
    } else if (fco === 0 || runway < 6) {
      continuityRegressionStatus = 'FRAGILE';
      score -= 15;
    }

    score = Math.max(0, score);

    let stabilityClassification: 'FULLY_STABLE' | 'STABLE_WITH_MONITORING' | 'FRAGILE_RECOVERY' | 'REGRESSION_RISK' | 'RECOVERY_COLLAPSE' = 'FULLY_STABLE';
    if (score >= 90) {
      stabilityClassification = 'FULLY_STABLE';
    } else if (score >= 70) {
      stabilityClassification = 'STABLE_WITH_MONITORING';
    } else if (score >= 50) {
      stabilityClassification = 'FRAGILE_RECOVERY';
    } else if (score >= 30) {
      stabilityClassification = 'REGRESSION_RISK';
    } else {
      stabilityClassification = 'RECOVERY_COLLAPSE';
    }

    return {
      recoveryStabilityScore: score,
      stabilityClassification,
      treasuryRegressionStatus,
      patrimonialRegressionStatus,
      continuityRegressionStatus
    };
  }
}
