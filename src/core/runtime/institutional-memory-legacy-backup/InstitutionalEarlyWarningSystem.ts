import { 
  PredictiveRecurrenceState, 
  FatigueState, 
  DeteriorationState, 
  EarlyWarningSignal, 
  TemporalEscalationState 
} from './types';

export class InstitutionalEarlyWarningSystem {
  public static evaluate(
    recurrence: PredictiveRecurrenceState,
    fatigue: FatigueState,
    deterioration: DeteriorationState,
    escalation: TemporalEscalationState,
    lineageHash: string
  ): EarlyWarningSignal[] {
    const warnings: EarlyWarningSignal[] = [];
    const auditReference = `ews-${Date.now()}`;

    // 4. Nenhuma predição poderá ocorrer com menos de 3 ciclos recorrentes.
    if (recurrence.recurrenceSeverity === 'INSUFFICIENT_RECURRENCE') {
      return warnings;
    }

    if (deterioration.deteriorationSeverity === 'CRITICAL' && recurrence.recurrenceFrequency >= 3) {
      warnings.push({
        warningType: 'RUNWAY_COLLAPSE_TENDENCY',
        description: 'Persistent severe deterioration indicates high probability of runway collapse.',
        recurrenceCycles: recurrence.recurrenceFrequency,
        lineageHash,
        auditReference
      });
    }

    if (fatigue.governanceExhaustionLevel === 'CRITICAL') {
      warnings.push({
        warningType: 'FATIGUE_THRESHOLD_BREACH',
        description: 'Governance fatigue has reached critical threshold due to sustained ignorance of alerts.',
        recurrenceCycles: recurrence.recurrenceFrequency,
        lineageHash,
        auditReference
      });
    }

    if (escalation.currentLevel === 'BOARD_INTERVENTION' || escalation.currentLevel === 'CRITICAL_GOVERNANCE_REVIEW') {
      warnings.push({
        warningType: 'GOVERNANCE_BREAKDOWN_TENDENCY',
        description: 'Escalation to board/critical review indicates impending governance breakdown.',
        recurrenceCycles: recurrence.recurrenceFrequency,
        lineageHash,
        auditReference
      });
    }

    if (recurrence.recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
      warnings.push({
        warningType: 'ANOMALY_ESCALATION_PATTERN',
        description: 'Anomalies have evolved into structural recurrences.',
        recurrenceCycles: recurrence.recurrenceFrequency,
        lineageHash,
        auditReference
      });
    }

    return warnings;
  }
}
