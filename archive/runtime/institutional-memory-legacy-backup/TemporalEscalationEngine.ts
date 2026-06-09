import { TemporalEscalationState, EscalationLevel } from './types';

export class TemporalEscalationEngine {
  public static evaluate(
    recurrenceSeverity: string,
    isTreasuryStress: boolean,
    isGovernanceFailure: boolean,
    recurrenceLineage: string[]
  ): TemporalEscalationState {
    
    let currentLevel: EscalationLevel = 'MONITOR';
    const progression: EscalationLevel[] = ['MONITOR'];
    const evidence: string[] = [];

    if (recurrenceSeverity === 'MODERATE') {
      currentLevel = 'MANAGEMENT_ACTION';
      progression.push('MANAGEMENT_ACTION');
      evidence.push('Moderate recurrence detected.');
    } else if (recurrenceSeverity === 'HIGH') {
      currentLevel = 'CFO_INTERVENTION';
      progression.push('MANAGEMENT_ACTION', 'CFO_INTERVENTION');
      evidence.push('High recurrence severity requires CFO oversight.');
    } else if (recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
      currentLevel = 'BOARD_INTERVENTION';
      progression.push('MANAGEMENT_ACTION', 'CFO_INTERVENTION', 'BOARD_INTERVENTION');
      evidence.push('Critical structural recurrence mandates board intervention.');
    }

    if (isTreasuryStress && recurrenceSeverity !== 'INSUFFICIENT_RECURRENCE') {
      evidence.push('Recurring treasury stress detected.');
      if (currentLevel !== 'BOARD_INTERVENTION' && (currentLevel as EscalationLevel) !== 'CRITICAL_GOVERNANCE_REVIEW') {
        currentLevel = 'CFO_INTERVENTION';
        if (!progression.includes('CFO_INTERVENTION')) progression.push('CFO_INTERVENTION');
      }
    }

    if (isGovernanceFailure && recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
      currentLevel = 'CRITICAL_GOVERNANCE_REVIEW';
      progression.push('CRITICAL_GOVERNANCE_REVIEW');
      evidence.push('Governance failures coupled with structural recurrence demand critical governance review.');
    }

    // Require lineage to escalate
    if (recurrenceLineage.length === 0 && currentLevel !== 'MONITOR') {
      throw new Error('ESCALATION_BLOCKED: Escalation sem recurrenceLineage é negada.');
    }

    return {
      currentLevel,
      escalationEvidence: evidence,
      recurrenceLineage,
      severityProgression: progression,
      auditReference: `audit-${Date.now()}`
    };
  }
}
