// src/core/runtime/institutional-recovery/InstitutionalReauthorizationEngine.ts

import { RecoveryStage, InstitutionalRecoveryOutput } from './RecoveryTypes';
import { ConsistencyValidationResult } from './RecoveryConsistencyValidationEngine';

export class InstitutionalReauthorizationEngine {
  public static evaluateStage(
    consistency: ConsistencyValidationResult,
    falseRecoveryDetected: boolean
  ): {
    activeRecoveryStage: RecoveryStage;
    allowedReauthorizations: string[];
    blockedReauthorizations: string[];
  } {
    if (falseRecoveryDetected || consistency.consecutivePositiveCycles === 0) {
      return {
        activeRecoveryStage: 'RECOVERY_MONITORING', // fallback default for blocked
        allowedReauthorizations: ['CASH_PRESERVATION', 'COST_CONTAINMENT'],
        blockedReauthorizations: ['ALL_STRATEGIC_ACTIONS', 'EXPANSION', 'DIVIDEND', 'CAPEX', 'HIRING']
      };
    }

    let stage: RecoveryStage = 'RECOVERY_MONITORING';
    
    const cycles = consistency.consecutivePositiveCycles;
    const treasuryResilient = consistency.treasuryRecoveryStatus === 'RESILIENT';
    const patrimonialRecovered = consistency.patrimonialRecoveryStatus === 'RECOVERED';

    if (cycles >= 6 && treasuryResilient && patrimonialRecovered) {
      stage = 'FULL_REAUTHORIZATION';
    } else if (cycles >= 5) {
      stage = 'RECOVERY_STAGE_3';
    } else if (cycles >= 4) {
      stage = 'RECOVERY_STAGE_2';
    } else if (cycles >= 3) {
      if (consistency.treasuryRecoveryStatus !== 'FRAGILE') {
        stage = 'RECOVERY_STAGE_1';
      } else {
        stage = 'RECOVERY_STAGE_1_PENDING';
      }
    } else if (cycles === 2) {
      stage = 'RECOVERY_STAGE_1_PENDING';
    } else {
      stage = 'RECOVERY_MONITORING';
    }

    let allowedReauthorizations: string[] = [];
    let blockedReauthorizations: string[] = [];

    switch (stage) {
      case 'RECOVERY_MONITORING':
      case 'RECOVERY_STAGE_1_PENDING':
        allowedReauthorizations = ['CASH_PRESERVATION', 'COST_CONTAINMENT', 'TREASURY_STABILIZATION'];
        blockedReauthorizations = ['EXPANSION', 'DIVIDEND', 'CAPEX', 'HIRING', 'OWNER_WITHDRAWAL', 'STRATEGIC_INVESTMENT'];
        break;
      case 'RECOVERY_STAGE_1':
        allowedReauthorizations = ['CASH_PRESERVATION', 'COST_CONTAINMENT', 'TREASURY_STABILIZATION'];
        blockedReauthorizations = ['EXPANSION', 'DIVIDEND', 'CAPEX', 'HIRING', 'OWNER_WITHDRAWAL', 'STRATEGIC_INVESTMENT'];
        break;
      case 'RECOVERY_STAGE_2':
        allowedReauthorizations = ['SELECTIVE_CAPEX', 'TACTICAL_HIRING', 'WORKING_CAPITAL_OPTIMIZATION'];
        blockedReauthorizations = ['DIVIDEND', 'AGGRESSIVE_EXPANSION', 'OWNER_WITHDRAWAL'];
        break;
      case 'RECOVERY_STAGE_3':
        allowedReauthorizations = ['CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION'];
        blockedReauthorizations = ['AGGRESSIVE_EXPANSION', 'PARTNER_EXTRACTION'];
        break;
      case 'FULL_REAUTHORIZATION':
        allowedReauthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION'];
        blockedReauthorizations = [];
        break;
    }

    return {
      activeRecoveryStage: stage,
      allowedReauthorizations,
      blockedReauthorizations
    };
  }
}
