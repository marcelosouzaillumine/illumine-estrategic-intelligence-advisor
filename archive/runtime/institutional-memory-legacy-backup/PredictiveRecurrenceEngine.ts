import { PredictiveRecurrenceState } from './types';

export class PredictiveRecurrenceEngine {
  public static evaluate(anomalyLineageHashes: string[], totalCycles: number): PredictiveRecurrenceState {
    // Regra mínima: menos de 3 ciclos = não classificar como padrão preditivo
    if (totalCycles < 3 || anomalyLineageHashes.length < 3) {
      return {
        recurrenceScore: 0,
        recurrenceFrequency: anomalyLineageHashes.length,
        recurrenceSeverity: 'INSUFFICIENT_RECURRENCE',
        recurrenceConfidence: 'UNVERIFIED',
        recurrenceLineage: anomalyLineageHashes
      };
    }

    const frequency = anomalyLineageHashes.length;
    const recurrenceScore = Math.min((frequency / totalCycles) * 100, 100);

    let severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_STRUCTURAL_RECURRENCE' = 'LOW';
    if (frequency >= 5 && frequency / totalCycles >= 0.8) {
      severity = 'CRITICAL_STRUCTURAL_RECURRENCE';
    } else if (frequency >= 4 || recurrenceScore >= 70) {
      severity = 'HIGH';
    } else if (frequency >= 3) {
      severity = 'MODERATE';
    }

    let confidence: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    if (totalCycles >= 5 && frequency >= 4) confidence = 'HIGH';
    else if (totalCycles >= 3 && frequency >= 3) confidence = 'MODERATE';

    return {
      recurrenceScore: Number(recurrenceScore.toFixed(2)),
      recurrenceFrequency: frequency,
      recurrenceSeverity: severity,
      recurrenceConfidence: confidence,
      recurrenceLineage: anomalyLineageHashes
    };
  }
}
