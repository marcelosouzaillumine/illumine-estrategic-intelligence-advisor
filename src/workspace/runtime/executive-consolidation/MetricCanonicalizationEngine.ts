export interface CanonicalMetricResult {
  canonicalMetric: string;
  sourceModule: string;
  reportedValue: number | null;
  canonicalValue: number | null;
  divergence: number;
  status: 'MATCH' | 'DIVERGENT' | 'MISSING';
}

export interface MetricCanonicalizationInput {
  ebitdaDre: number | null;
  ebitdaEfos: number | null;
  lucroLiquidoDre: number | null;
  lucroLiquidoEfos: number | null;
  fcoDfc: number | null;
  fcoEfos: number | null;
  caixaFinalDfc: number | null;
  caixaFinalEfos: number | null;
  patrimonioLiquidoBp: number | null;
  patrimonioLiquidoEfos: number | null;
  capitalConsumidoDlpa: number | null;
  capitalConsumidoEfos: number | null;
}

export class MetricCanonicalizationEngine {
  /**
   * Garante que métricas consolidadas venham exclusivamente de seus módulos de origem.
   */
  public static canonicalize(input: MetricCanonicalizationInput): Record<string, CanonicalMetricResult> {
    const canonicalizeMetric = (
      name: string,
      source: string,
      canonicalVal: number | null,
      reportedVal: number | null
    ): CanonicalMetricResult => {
      if (canonicalVal === null || canonicalVal === undefined) {
        return {
          canonicalMetric: name,
          sourceModule: source,
          reportedValue: reportedVal ?? null,
          canonicalValue: null,
          divergence: 0,
          status: 'MISSING'
        };
      }

      const reported = reportedVal ?? 0;
      const divergence = Math.abs(canonicalVal - reported);
      // Tolerance for floating point diffs
      const status = divergence > 0.01 ? 'DIVERGENT' : 'MATCH';

      return {
        canonicalMetric: name,
        sourceModule: source,
        reportedValue: reported,
        canonicalValue: canonicalVal,
        divergence,
        status
      };
    };

    return {
      EBITDA: canonicalizeMetric('EBITDA', 'DRE', input.ebitdaDre, input.ebitdaEfos),
      LucroLiquido: canonicalizeMetric('Lucro Líquido', 'DRE', input.lucroLiquidoDre, input.lucroLiquidoEfos),
      FCO: canonicalizeMetric('FCO', 'DFC', input.fcoDfc, input.fcoEfos),
      CaixaFinal: canonicalizeMetric('Caixa Final', 'DFC/BP', input.caixaFinalDfc, input.caixaFinalEfos),
      PatrimonioLiquido: canonicalizeMetric('Patrimônio Líquido', 'BP/DLPA', input.patrimonioLiquidoBp, input.patrimonioLiquidoEfos),
      CapitalConsumido: canonicalizeMetric('Capital Consumido', 'DLPA', input.capitalConsumidoDlpa, input.capitalConsumidoEfos)
    };
  }
}
