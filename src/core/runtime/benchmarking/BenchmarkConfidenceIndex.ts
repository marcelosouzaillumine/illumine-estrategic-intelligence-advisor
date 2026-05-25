import { BenchmarkCohort, BenchmarkConfidenceSignal } from './BenchmarkTypes';

export class BenchmarkConfidenceIndex {
  /**
   * Calcula o "Institutional Confidence Index" para a Cohort inteira.
   * Não altera nem reflete individualidades.
   */
  static calculateIndex(cohort: BenchmarkCohort): Record<BenchmarkConfidenceSignal, number> {
    const distribution: Record<BenchmarkConfidenceSignal, number> = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      CRITICAL: 0
    };

    if (cohort.size === 0) return distribution;

    cohort.profiles.forEach(p => {
      distribution[p.confidence]++;
    });

    // Converte para percentuais (0 a 100)
    (Object.keys(distribution) as BenchmarkConfidenceSignal[]).forEach(k => {
      distribution[k] = Math.round((distribution[k] / cohort.size) * 100);
    });

    return distribution;
  }
}
