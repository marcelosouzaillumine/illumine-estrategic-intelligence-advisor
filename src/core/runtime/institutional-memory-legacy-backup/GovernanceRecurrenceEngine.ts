import { HistoricalCycleData } from './types';

export class GovernanceRecurrenceEngine {
  public static evaluate(cycles: HistoricalCycleData[]): {
    recurrenceSeverity: 'LOW_RECURRENCE' | 'MODERATE_RECURRENCE' | 'HIGH_RECURRENCE' | 'CRITICAL_STRUCTURAL_RECURRENCE';
    deteriorationSignals: string[];
    structuralPersistence: string[];
    operationalRecurrence: string[];
  } {
    if (!cycles || cycles.length < 3) {
      return {
        recurrenceSeverity: 'LOW_RECURRENCE',
        deteriorationSignals: [],
        structuralPersistence: [],
        operationalRecurrence: []
      };
    }

    const sorted = [...cycles].sort((a, b) => a.year - b.year);
    
    const deteriorationSignals: string[] = [];
    const structuralPersistence: string[] = [];
    const operationalRecurrence: string[] = [];

    // 1. Detect recurring governance failures & anomalies
    const governanceFailures = this.detectRecurringGovernanceFailures(sorted);
    const repeatedStress = this.detectRepeatedStress(sorted);
    const recurringAnomalies = this.detectRecurringAnomalies(sorted);
    const negligence = this.detectInstitutionalNegligence(sorted);

    structuralPersistence.push(...governanceFailures.messages);
    structuralPersistence.push(...recurringAnomalies.messages);
    operationalRecurrence.push(...repeatedStress.messages);
    deteriorationSignals.push(...negligence.messages);

    // Score deterioration fallback
    let scoreDecreasedConsecutively = true;
    for (let i = 1; i < sorted.length; i++) {
      const prevScore = sorted[i - 1].scores?.composite || 0;
      const currentScore = sorted[i].scores?.composite || 0;
      if (currentScore >= prevScore) {
        scoreDecreasedConsecutively = false;
        break;
      }
    }

    if (scoreDecreasedConsecutively && sorted.length >= 3) {
      deteriorationSignals.push(
        `O score composto declinou consecutivamente nos últimos ${sorted.length} ciclos: de ${sorted[0].scores?.composite || 0} para ${sorted[sorted.length - 1].scores?.composite || 0}.`
      );
    }

    // Determine severity
    let recurrenceSeverity: 'LOW_RECURRENCE' | 'MODERATE_RECURRENCE' | 'HIGH_RECURRENCE' | 'CRITICAL_STRUCTURAL_RECURRENCE' = 'LOW_RECURRENCE';

    if (governanceFailures.hasCritical || recurringAnomalies.hasCritical || negligence.hasCritical || repeatedStress.hasCritical) {
      recurrenceSeverity = 'CRITICAL_STRUCTURAL_RECURRENCE';
    } else if (governanceFailures.hasHigh || repeatedStress.hasHigh || recurringAnomalies.hasHigh || negligence.hasHigh || scoreDecreasedConsecutively) {
      recurrenceSeverity = 'HIGH_RECURRENCE';
    } else if (governanceFailures.hasModerate || repeatedStress.hasModerate || recurringAnomalies.hasModerate || negligence.hasModerate) {
      recurrenceSeverity = 'MODERATE_RECURRENCE';
    }

    return {
      recurrenceSeverity,
      deteriorationSignals,
      structuralPersistence,
      operationalRecurrence
    };
  }

  public static detectRecurringGovernanceFailures(cycles: HistoricalCycleData[]) {
    return this.detectViolationPattern(cycles, v => v.sourceContext.includes('Governance') || v.severity === 'CRITICAL');
  }

  public static detectRepeatedStress(cycles: HistoricalCycleData[]) {
    return this.detectViolationPattern(cycles, v => v.message.toLowerCase().includes('stress') || v.message.toLowerCase().includes('pressão'));
  }

  public static detectRecurringAnomalies(cycles: HistoricalCycleData[]) {
    return this.detectViolationPattern(cycles, v => v.sourceContext.includes('Anomaly') || v.violationId.includes('ANOMALY'));
  }

  public static detectInstitutionalNegligence(cycles: HistoricalCycleData[]) {
    // Negligence can be tied to decisions never approved over 3 cycles
    let unapprovedCount = 0;
    cycles.forEach(c => {
      if (c.decisions && c.decisions.some(d => d.approvalState === 'IGNORED' || d.approvalState === 'REJECTED')) {
        unapprovedCount++;
      }
    });

    return {
      messages: unapprovedCount >= 3 ? ['Negligência Institucional: Decisões fiduciárias rejeitadas ou ignoradas em 3 ou mais ciclos.'] : [],
      hasCritical: unapprovedCount >= 4,
      hasHigh: unapprovedCount === 3,
      hasModerate: unapprovedCount === 2
    };
  }

  private static detectViolationPattern(cycles: HistoricalCycleData[], filterFn: (v: any) => boolean) {
    const violationMap = new Map<string, { count: number; details: any }>();
    const newestCycle = cycles[cycles.length - 1];
    
    for (const cycle of cycles) {
      const violations = (cycle.violations || []).filter(filterFn);
      for (const v of violations) {
        if (!violationMap.has(v.violationId)) {
          violationMap.set(v.violationId, { count: 0, details: v });
        }
        violationMap.get(v.violationId)!.count++;
      }
    }

    const messages: string[] = [];
    let hasCritical = false;
    let hasHigh = false;
    let hasModerate = false;

    const currentViolations = (newestCycle.violations || []).filter(filterFn);
    for (const cv of currentViolations) {
      const record = violationMap.get(cv.violationId);
      if (record && record.count >= 2) {
        messages.push(`A violação "${cv.message}" (${cv.violationId}) no contexto ${cv.sourceContext} persiste por ${record.count} ciclos.`);
        if (cv.severity === 'CRITICAL' && record.count >= 3) hasCritical = true;
        else if (cv.severity === 'CRITICAL' || record.count >= 3) hasHigh = true;
        else hasModerate = true;
      }
    }

    return { messages, hasCritical, hasHigh, hasModerate };
  }
}
