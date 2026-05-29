export interface UnitEconomicsMetrics {
  contributionMargin: number;
  breakevenPoint: number;
  currentRevenue: number;
}

export interface UnitEconomicsInsight {
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  narrative: string;
}

export class DREUnitEconomicsEngine {
  /**
   * Avalia contribuição marginal, ponto de equilíbrio e sustentabilidade de crescimento.
   */
  public static evaluate(metrics: UnitEconomicsMetrics): UnitEconomicsInsight {
    if (metrics.contributionMargin <= 0) {
      return {
        status: 'CRITICAL',
        narrative: 'Margem de contribuição negativa. O modelo de negócios destrói valor a cada unidade vendida, inviabilizando qualquer tese de escalabilidade.'
      };
    }

    const breakevenDistance = ((metrics.currentRevenue - metrics.breakevenPoint) / metrics.breakevenPoint) * 100;

    if (metrics.currentRevenue < metrics.breakevenPoint) {
      return {
        status: 'CRITICAL',
        narrative: `A operação atua abaixo do ponto de equilíbrio (${Math.abs(breakevenDistance).toFixed(1)}% de gap). A escala atual é insuficiente para viabilizar os unit economics estruturais.`
      };
    }

    if (breakevenDistance < 15) {
      return {
        status: 'WARNING',
        narrative: `A operação está perigosamente próxima ao ponto de equilíbrio (${breakevenDistance.toFixed(1)}% acima). O crescimento sustentável exige maior diluição de custos fixos.`
      };
    }

    return {
      status: 'HEALTHY',
      narrative: 'Os unit economics suportam a expansão. A operação possui escala suficiente para diluir a estrutura e gerar contribuição marginal positiva.'
    };
  }
}
