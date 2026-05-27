import { HistoricalCycleData } from './types';

export class PatternRecurrenceResolver {
  public static resolve(cycles: HistoricalCycleData[], recurrenceSeverity: string): string[] {
    if (!cycles || cycles.length < 3) {
      return []; // Fail-closed
    }

    const sorted = [...cycles].sort((a, b) => a.year - b.year);
    const newest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];
    const oldest = sorted[0];

    const patterns: string[] = [];

    const newestScore = newest.scores?.composite || 0;
    const previousScore = previous.scores?.composite || 0;
    const oldestScore = oldest.scores?.composite || 0;

    let isConsecutiveIncrease = true;
    let isConsecutiveDecrease = true;

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1].scores?.composite || 0;
      const curr = sorted[i].scores?.composite || 0;
      if (curr <= prev) isConsecutiveIncrease = false;
      if (curr >= prev) isConsecutiveDecrease = false;
    }

    if (isConsecutiveIncrease) {
      patterns.push('Recuperação consistente dos fundamentos de governança e financeiros.');
    } else if (isConsecutiveDecrease) {
      patterns.push('Deterioração progressiva e recorrente das notas estruturais.');
    } else {
      // Inflexion check
      if (newestScore > previousScore && previousScore < oldestScore) {
        patterns.push('Inflexão operacional positiva detectada no último ciclo.');
      } else if (Math.abs(newestScore - oldestScore) <= 3) {
        patterns.push('Estabilização tática dos indicadores de governança.');
      }
    }

    // Severity mapping
    if (recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
      patterns.push('Recorrência crítica de violações fiduciárias.');
    } else if (recurrenceSeverity === 'HIGH_RECURRENCE' || recurrenceSeverity === 'MODERATE_RECURRENCE') {
      patterns.push('Recorrência leve de desvios operacionais.');
    }

    return patterns;
  }
}
