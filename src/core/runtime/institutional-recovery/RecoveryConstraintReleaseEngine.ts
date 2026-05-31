// src/core/runtime/institutional-recovery/RecoveryConstraintReleaseEngine.ts

import { RecoveryStage } from './RecoveryTypes';

export class RecoveryConstraintReleaseEngine {
  public static evaluateConstraints(
    stage: RecoveryStage,
    consistencyScore: number
  ): {
    releasedConstraints: string[];
    remainingConstraints: string[];
  } {
    const allConstraints = [
      'SURVIVAL_MODE_LOCK',
      'DIVIDEND_LOCK',
      'CAPEX_LOCK',
      'EXPANSION_LOCK',
      'HIRING_LOCK',
      'STRATEGIC_INVESTMENT_LOCK',
      'PARTNER_WITHDRAWAL_LOCK'
    ];

    let releasedConstraints: string[] = [];
    let remainingConstraints: string[] = [...allConstraints];

    const release = (constraint: string) => {
      releasedConstraints.push(constraint);
      remainingConstraints = remainingConstraints.filter(c => c !== constraint);
    };

    if (stage === 'RECOVERY_STAGE_1_PENDING' || stage === 'RECOVERY_MONITORING') {
      // Nothing released yet
    } else if (stage === 'RECOVERY_STAGE_1') {
      release('SURVIVAL_MODE_LOCK');
    } else if (stage === 'RECOVERY_STAGE_2') {
      release('SURVIVAL_MODE_LOCK');
      release('CAPEX_LOCK');
      release('HIRING_LOCK');
    } else if (stage === 'RECOVERY_STAGE_3') {
      release('SURVIVAL_MODE_LOCK');
      release('CAPEX_LOCK');
      release('HIRING_LOCK');
      release('EXPANSION_LOCK');
      release('STRATEGIC_INVESTMENT_LOCK');
    } else if (stage === 'FULL_REAUTHORIZATION') {
      // Release everything
      releasedConstraints = [...allConstraints];
      remainingConstraints = [];
    }

    return {
      releasedConstraints,
      remainingConstraints
    };
  }
}
