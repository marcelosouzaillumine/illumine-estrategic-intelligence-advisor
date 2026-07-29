export enum IntelligenceMaturityLevel {
  INFORMATIVA = 'INFORMATIVA', // 0-20
  ANALITICA = 'ANALITICA',     // 21-40
  CONSULTIVA = 'CONSULTIVA',   // 41-60
  PREDITIVA = 'PREDITIVA',     // 61-80
  ADAPTATIVA = 'ADAPTATIVA'    // 81-100
}

export class MaturityEvaluator {
  public static getLevelForScore(score: number): IntelligenceMaturityLevel {
    if (score <= 20) return IntelligenceMaturityLevel.INFORMATIVA;
    if (score <= 40) return IntelligenceMaturityLevel.ANALITICA;
    if (score <= 60) return IntelligenceMaturityLevel.CONSULTIVA;
    if (score <= 80) return IntelligenceMaturityLevel.PREDITIVA;
    return IntelligenceMaturityLevel.ADAPTATIVA;
  }
}
