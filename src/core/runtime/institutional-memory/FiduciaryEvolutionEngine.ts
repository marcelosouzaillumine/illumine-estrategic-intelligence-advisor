import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export class FiduciaryEvolutionEngine {
  /**
   * Validates if a positive sign (e.g. DRE improvement) is a true turnaround or just a spike.
   * Blocks fake turnarounds if there isn't sustained multi-cycle structural evidence.
   */
  public static validateTurnaround(
    ledger: InstitutionalDecisionLedger, 
    currentCycleDREPositive: boolean,
    historicalCyclesCount: number
  ): { isTrueTurnaround: boolean; reason: string } {
    if (!currentCycleDREPositive) {
      return { isTrueTurnaround: false, reason: 'Sem indícios de recuperação operacional no ciclo atual.' };
    }

    if (historicalCyclesCount < 3) {
      return { 
        isTrueTurnaround: false, 
        reason: 'Um único ciclo ou histórico incipiente não pode configurar um turnaround fiduciário estrutural. Falta lastro longitudinal.' 
      };
    }

    const events = ledger.getEvents();
    const recentImprovements = events.filter(e => e.eventType === 'STRUCTURAL_IMPROVEMENT').length;
    const unresolvedRisks = events.filter(e => e.eventType === 'UNRESOLVED_RISK').length;

    if (unresolvedRisks > 0) {
      return {
        isTrueTurnaround: false,
        reason: 'Recuperação de DRE mascarada por riscos estruturais (ex: capital de giro ou dívida) não resolvidos longitudinalmente.'
      };
    }

    if (recentImprovements >= 2) {
      return {
        isTrueTurnaround: true,
        reason: 'Turnaround validado: melhorias estruturais sustentadas por múltiplos ciclos consecutivos.'
      };
    }

    return {
      isTrueTurnaround: false,
      reason: 'Recuperação pontual sem sustentação multi-ciclo.'
    };
  }
}
