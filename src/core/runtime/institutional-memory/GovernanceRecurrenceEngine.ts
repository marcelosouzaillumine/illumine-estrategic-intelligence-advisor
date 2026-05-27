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
    const newestCycle = sorted[sorted.length - 1];

    const deteriorationSignals: string[] = [];
    const structuralPersistence: string[] = [];
    const operationalRecurrence: string[] = [];

    // 1. Detect violation reoccurrence (reincidência de violations)
    const violationMap = new Map<string, { count: number; maxConsecutive: number; currentConsecutive: number; details: any }>();

    for (let i = 0; i < sorted.length; i++) {
      const cycle = sorted[i];
      const violations = cycle.violations || [];
      for (const v of violations) {
        if (!violationMap.has(v.violationId)) {
          violationMap.set(v.violationId, { count: 0, maxConsecutive: 0, currentConsecutive: 0, details: v });
        }
        const record = violationMap.get(v.violationId)!;
        record.count++;
        // Check if consecutive
        if (i === 0 || (sorted[i-1].violations || []).some(pv => pv.violationId === v.violationId)) {
          record.currentConsecutive++;
        } else {
          record.currentConsecutive = 1;
        }
        record.maxConsecutive = Math.max(record.maxConsecutive, record.currentConsecutive);
      }
    }

    let hasCriticalRecurrence = false;
    let hasHighRecurrence = false;
    let hasModerateRecurrence = false;

    // Check violation frequencies from newest cycle
    const currentViolations = newestCycle.violations || [];
    for (const cv of currentViolations) {
      const record = violationMap.get(cv.violationId);
      if (record && record.count >= 2) {
        structuralPersistence.push(
          `A violação "${cv.message}" (${cv.violationId}) no contexto ${cv.sourceContext} persiste por ${record.count} ciclos.`
        );

        if (cv.severity === 'CRITICAL' && record.count >= 3) {
          hasCriticalRecurrence = true;
        } else if (cv.severity === 'CRITICAL' || record.count >= 3) {
          hasHighRecurrence = true;
        } else {
          hasModerateRecurrence = true;
        }
      }
    }

    // 2. Score deterioration
    // Check if score.composite is consecutively decreasing
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
        `O score composto declinou consecutivamente nos últimos ${sorted.length} ciclos: de ${sorted[0].scores?.composite || 0} para ${newestCycle.scores?.composite || 0}.`
      );
      hasHighRecurrence = true;
    }

    // Determine recurrence severity level
    let recurrenceSeverity: 'LOW_RECURRENCE' | 'MODERATE_RECURRENCE' | 'HIGH_RECURRENCE' | 'CRITICAL_STRUCTURAL_RECURRENCE' = 'LOW_RECURRENCE';

    if (hasCriticalRecurrence) {
      recurrenceSeverity = 'CRITICAL_STRUCTURAL_RECURRENCE';
    } else if (hasHighRecurrence) {
      recurrenceSeverity = 'HIGH_RECURRENCE';
    } else if (hasModerateRecurrence) {
      recurrenceSeverity = 'MODERATE_RECURRENCE';
    }

    return {
      recurrenceSeverity,
      deteriorationSignals,
      structuralPersistence,
      operationalRecurrence
    };
  }
}
