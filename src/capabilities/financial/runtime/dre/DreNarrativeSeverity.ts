export type NarrativeSeverity = 'UNSUSTAINABLE' | 'PRESSURIZED' | 'BORDERLINE' | 'ADEQUATE' | 'STRONG' | 'EXCELLENT';

import { DreExecutiveFacts } from './DreExecutiveFactsBuilder';

export class DreNarrativeSeverity {
  public static forNetMargin(margin: number): NarrativeSeverity {
    if (margin < 0) return 'UNSUSTAINABLE';
    if (margin <= 0.03) return 'BORDERLINE'; // Viabilidade mínima, limítrofe
    if (margin <= 0.10) return 'ADEQUATE';
    if (margin <= 0.15) return 'ADEQUATE'; // Moderada
    return 'STRONG'; // > 15% ou > 20%
  }

  public static forBreakEvenCoverage(coverage: number): NarrativeSeverity {
    if (coverage < 1.0) return 'UNSUSTAINABLE'; // Insuficiência de receita
    if (coverage <= 1.1) return 'BORDERLINE'; // Equilíbrio estreito
    if (coverage <= 1.5) return 'ADEQUATE'; // Adequada
    return 'STRONG'; // > 150% margem de segurança relevante
  }

  public static forEbitdaMargin(margin: number): NarrativeSeverity {
    if (margin < 0) return 'UNSUSTAINABLE'; // Déficit operacional
    if (margin <= 0.05) return 'PRESSURIZED'; // Geração operacional estreita
    if (margin <= 0.20) return 'ADEQUATE'; // Geração operacional funcional/moderada
    return 'STRONG'; // > 20% geração operacional robusta
  }

  public static getCompositeSeverity(facts: DreExecutiveFacts, baseSeverity: NarrativeSeverity): NarrativeSeverity {
    if (baseSeverity !== 'STRONG') return baseSeverity;

    const isExcellent = 
      facts.netMargin > 0.20 && 
      facts.breakEvenCoverage > 2.50 && 
      facts.ebitdaMargin > 0.20;
    
    // Simplification for fixed expense pressure not deteriorating:
    // If breakEvenCoverage dropped significantly, it's not excellent.
    // We don't have direct access to last year's coverage here, but we can assume EXCELLENT only if conditions meet.
    // The compiler longitudinal logic will handle the specific 2024->2025 drop.
    return isExcellent ? 'EXCELLENT' : baseSeverity;
  }
}
