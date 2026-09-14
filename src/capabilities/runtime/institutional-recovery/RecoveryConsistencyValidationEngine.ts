// src/core/runtime/institutional-recovery/RecoveryConsistencyValidationEngine.ts

import { RecoveryEvaluationInput } from './RecoveryTypes';

export interface ConsistencyValidationResult {
  consistencyScore: number;
  longitudinalValidationStatus: 'INSUFFICIENT_HISTORY' | 'PARTIAL_VALIDATION' | 'LONGITUDINAL_VALIDATION_COMPLETE';
  consecutivePositiveCycles: number;
  treasuryRecoveryStatus: 'FRAGILE' | 'STABILIZING' | 'RESILIENT';
  patrimonialRecoveryStatus: 'ERODED' | 'STABILIZING' | 'RECOVERED';
  governanceRecoveryStatus: 'RESTRICTED' | 'PARTIALLY_RESTORED' | 'NORMALIZED';
}

export class RecoveryConsistencyValidationEngine {
  public static validate(input: RecoveryEvaluationInput): ConsistencyValidationResult {
    const historicalCycles = input.historicalCycles || [];
    const fco = input.fco ?? 0;
    
    // Calculate consecutive positive cycles
    let consecutivePositiveCycles = 0;
    
    // First, check the current cycle
    if (fco > 0) {
      consecutivePositiveCycles++;
      // Then check historical cycles going backwards
      for (let i = 0; i < historicalCycles.length; i++) {
        const cycleFco = historicalCycles[i].fco ?? historicalCycles[i].netIncome ?? 0;
        if (cycleFco > 0) {
          consecutivePositiveCycles++;
        } else {
          break; // Stop at the first non-positive cycle
        }
      }
    }

    let longitudinalValidationStatus: 'INSUFFICIENT_HISTORY' | 'PARTIAL_VALIDATION' | 'LONGITUDINAL_VALIDATION_COMPLETE' = 'INSUFFICIENT_HISTORY';
    
    if (consecutivePositiveCycles >= 3) {
      longitudinalValidationStatus = 'LONGITUDINAL_VALIDATION_COMPLETE';
    } else if (consecutivePositiveCycles > 0) {
      longitudinalValidationStatus = 'PARTIAL_VALIDATION';
    }

    // Treasury Status
    const runway = input.cashIntelligenceRuntime?.continuityRisk?.projectedRunwayMonths || 0;
    let treasuryRecoveryStatus: 'FRAGILE' | 'STABILIZING' | 'RESILIENT' = 'FRAGILE';
    
    if (runway > 6 && consecutivePositiveCycles >= 2) {
      treasuryRecoveryStatus = 'RESILIENT';
    } else if (runway > 3 && consecutivePositiveCycles >= 1) {
      treasuryRecoveryStatus = 'STABILIZING';
    }

    // Patrimonial Status
    const integrityStatus = input.fiduciaryOutput?.patrimonialIntegrityStatus;
    let patrimonialRecoveryStatus: 'ERODED' | 'STABILIZING' | 'RECOVERED' = 'ERODED';
    
    if (integrityStatus === 'PRESERVED') {
      patrimonialRecoveryStatus = 'RECOVERED';
    } else if (integrityStatus === 'PRESSURED') {
      patrimonialRecoveryStatus = 'STABILIZING';
    } else {
      patrimonialRecoveryStatus = 'ERODED';
    }

    // Governance Status
    const retention = input.fiduciaryOutput?.retentionClassification;
    let governanceRecoveryStatus: 'RESTRICTED' | 'PARTIALLY_RESTORED' | 'NORMALIZED' = 'RESTRICTED';
    
    if (retention !== 'FORCED_RETENTION' && retention !== 'EMERGENCY_RETENTION') {
      if (consecutivePositiveCycles >= 3) {
        governanceRecoveryStatus = 'NORMALIZED';
      } else if (consecutivePositiveCycles >= 1) {
        governanceRecoveryStatus = 'PARTIALLY_RESTORED';
      }
    }

    // Calculate Consistency Score (0-100)
    let score = 0;
    score += Math.min(consecutivePositiveCycles * 20, 60); // up to 60 points for cycles
    
    if (treasuryRecoveryStatus === 'RESILIENT') score += 20;
    else if (treasuryRecoveryStatus === 'STABILIZING') score += 10;
    
    if (patrimonialRecoveryStatus === 'RECOVERED') score += 10;
    else if (patrimonialRecoveryStatus === 'STABILIZING') score += 5;
    
    if (governanceRecoveryStatus === 'NORMALIZED') score += 10;
    else if (governanceRecoveryStatus === 'PARTIALLY_RESTORED') score += 5;

    return {
      consistencyScore: score,
      longitudinalValidationStatus,
      consecutivePositiveCycles,
      treasuryRecoveryStatus,
      patrimonialRecoveryStatus,
      governanceRecoveryStatus
    };
  }
}
