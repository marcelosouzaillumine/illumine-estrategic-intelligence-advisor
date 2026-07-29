export interface MetricIntelligenceContext {
  readonly pageId: string;
  readonly activeMetric?: string;
}

export interface MetricInsightView {
  readonly metricName: string;
  readonly insightText: string;
  readonly impactLevel: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  readonly recommendedAction: string;
}

export class ExecutiveMetricIntelligenceLayer {
  public static resolveMetricInsights(ctx: MetricIntelligenceContext): readonly MetricInsightView[] {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return [
        {
          metricName: 'Margem EBITDA',
          insightText: 'Variação de despesas comerciais pressiona o resultado operacional.',
          impactLevel: 'HIGH',
          recommendedAction: 'Revisar custos de vendas e orçamento operacional.'
        },
        {
          metricName: 'Lucro Líquido',
          insightText: 'Resultado final impactado positivamente por receitas financeiras.',
          impactLevel: 'MEDIUM',
          recommendedAction: 'Preservar margem operacional sem dependência financeira.'
        }
      ];
    }

    if (pageId === 'BalanceSheetPage') {
      return [
        {
          metricName: 'Liquidez Corrente',
          insightText: 'Cobertura de obrigações de curto prazo requer atenção.',
          impactLevel: 'CRITICAL',
          recommendedAction: 'Reforçar capital de giro operacional.'
        }
      ];
    }

    return [
      {
        metricName: 'EFOS Composite Score',
        insightText: 'Índice de saúde financeira consolidado em nível de estabilidade.',
        impactLevel: 'HIGH',
        recommendedAction: 'Manter governança fiduciária contínua.'
      }
    ];
  }
}
