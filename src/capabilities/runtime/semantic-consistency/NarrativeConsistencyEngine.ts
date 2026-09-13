export enum NarrativeStatus {
  COMPATIBLE = 'COMPATIBLE',
  NARRATIVE_CONFLICT = 'NARRATIVE_CONFLICT'
}

export class NarrativeConsistencyEngine {
  /**
   * Avalia um conjunto de narrativas para detectar mensagens incompatíveis ou conflitantes.
   * Utiliza heurística semântica baseada em vetores de sentimento/força.
   */
  public static evaluate(narratives: string[]): NarrativeStatus {
    if (!narratives || narratives.length < 2) return NarrativeStatus.COMPATIBLE;

    let hasPositive = false;
    let hasNegative = false;

    const positiveKeywords = ['forte', 'robusto', 'crescimento', 'excelente', 'sólido', 'sólida', 'madura', 'robusta'];
    const negativeKeywords = ['limitação', 'limitada', 'severa', 'severas', 'fraco', 'inicial', 'risco', 'insolvência', 'crítico'];

    narratives.forEach(text => {
      const lower = text.toLowerCase();
      if (positiveKeywords.some(kw => lower.includes(kw))) hasPositive = true;
      if (negativeKeywords.some(kw => lower.includes(kw))) hasNegative = true;
    });

    if (hasPositive && hasNegative) {
      return NarrativeStatus.NARRATIVE_CONFLICT;
    }

    return NarrativeStatus.COMPATIBLE;
  }
}
