/**
 * DRERecoverabilityGovernanceEngine
 * 
 * DEGFF v1.1 — Deterministic governance for Recoverability assessment.
 */

export class DRERecoverabilityGovernanceEngine {
  public static evaluate(coveragePercentage: number, grossMargin: number): string {
    if (coveragePercentage > 90 && grossMargin > 0.3) {
      return 'Alta';
    }
    if (coveragePercentage >= 60 && coveragePercentage <= 90 && grossMargin > 0) {
      return 'Moderada';
    }
    if (coveragePercentage >= 30 && coveragePercentage < 60) {
      return 'Baixa';
    }
    return 'Crítica';
  }
}
