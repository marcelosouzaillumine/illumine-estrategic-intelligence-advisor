import { ExecutiveOpinion } from '@illumine/executive-contracts';

export class ConflictResolver {
  public static resolveDivergences(opinions: ExecutiveOpinion[]): {
    divergencesFound: boolean;
    notes: string[];
  } {
    const notes: string[] = [];
    if (opinions.length < 2) {
      return { divergencesFound: false, notes: ['Sem divergências (parecer único).'] };
    }

    const lowConfidence = opinions.filter(o => o.confidence.value < 0.85);
    if (lowConfidence.length > 0) {
      notes.push(`Atenção: ${lowConfidence.length} agente(s) apresentaram confiança abaixo de 85%.`);
    }

    return {
      divergencesFound: notes.length > 0,
      notes
    };
  }
}
