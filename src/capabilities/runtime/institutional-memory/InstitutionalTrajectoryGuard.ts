import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export class InstitutionalTrajectoryGuard {
  /**
   * Acts as a fail-closed lock on evolutionary claims. 
   * If there's no sufficient history, all evolutionary insights are blocked.
   */
  public static canEmitEvolutionaryClaims(historicalCyclesCount: number): boolean {
    // Requires at least 2 historical cycles to compare (the current one and one past)
    return historicalCyclesCount >= 2;
  }

  public static enforce(historicalCyclesCount: number, proposedClaim: string): string {
    if (!this.canEmitEvolutionaryClaims(historicalCyclesCount)) {
      return 'Diagnóstico Inicial. Histórico insuficiente para validação de tendência longitudinal.';
    }
    return proposedClaim;
  }
}
