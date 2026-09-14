export type SemanticTag = 
  | 'BASE_CONTEXT'
  | 'LONGITUDINAL_LIMITATION'
  | 'LOW_HISTORICAL_DENSITY'
  | 'PARTIAL_CONTEXT'
  | 'NON_CONCLUSIVE_EVOLUTION'
  | 'MATURITY_CLAIM'
  | 'PREDICTIVE_STRESS'
  | 'INSTITUTIONAL_MEMORY'
  | 'STABILITY_CLAIM'
  | 'TREND_CLAIM';

export interface SemanticSentence {
  text: string;
  tags: SemanticTag[];
}

export class InstitutionalSemanticGraph {
  /**
   * Avalia a precedência e a supressão entre tags semânticas.
   * Exemplo: LONGITUDINAL_LIMITATION suprime MATURITY_CLAIM, STABILITY_CLAIM, TREND_CLAIM.
   * Retorna true se a sentença deve ser suprimida (ignorada) devido ao grafo atual.
   */
  public static shouldSuppress(sentence: SemanticSentence, activeTags: Set<SemanticTag>): boolean {
    const hasLongitudinalLimitation = 
      activeTags.has('LONGITUDINAL_LIMITATION') || 
      activeTags.has('LOW_HISTORICAL_DENSITY') || 
      activeTags.has('PARTIAL_CONTEXT') || 
      activeTags.has('NON_CONCLUSIVE_EVOLUTION');

    if (hasLongitudinalLimitation) {
      const isClaimingEvolution = sentence.tags.some(tag => 
        tag === 'MATURITY_CLAIM' || 
        tag === 'STABILITY_CLAIM' || 
        tag === 'TREND_CLAIM'
      );
      if (isClaimingEvolution) return true;
    }

    // Impede múltiplas afirmações de limitação (já avisou que tem pouco histórico, não repete)
    const isLimitation = sentence.tags.some(tag => 
      tag === 'LONGITUDINAL_LIMITATION' || 
      tag === 'LOW_HISTORICAL_DENSITY' || 
      tag === 'PARTIAL_CONTEXT' || 
      tag === 'NON_CONCLUSIVE_EVOLUTION'
    );
    if (isLimitation && hasLongitudinalLimitation) return true;

    return false;
  }
}
