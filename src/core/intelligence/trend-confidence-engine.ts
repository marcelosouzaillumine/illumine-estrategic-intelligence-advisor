export type TrendConfidenceLevel = 'LOW_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'HIGH_CONFIDENCE';

export interface TrendConfidence {
  level: TrendConfidenceLevel;
  explanation: string;
}

export function evaluateTrendConfidence(historicalPeriodsAnalyzed: number): TrendConfidence {
  if (historicalPeriodsAnalyzed < 3) {
    return {
      level: 'LOW_CONFIDENCE',
      explanation: 'Histórico insuficiente para inferência temporal robusta. A análise considera apenas sinais direcionais preliminares.'
    };
  } else if (historicalPeriodsAnalyzed >= 3 && historicalPeriodsAnalyzed <= 4) {
    return {
      level: 'MEDIUM_CONFIDENCE',
      explanation: 'Série histórica razoável. Permite inferência temporal com confiabilidade direcional, mas suscetível a variações táticas.'
    };
  } else {
    return {
      level: 'HIGH_CONFIDENCE',
      explanation: 'Histórico longitudinal robusto. Tendências estruturais comprovadas com alta confiabilidade analítica.'
    };
  }
}
