import { ExecutiveDecisionContext } from '@illumine/executive-contracts';

export interface ExecutiveRecommendationView {
  readonly recommendationText: string;
  readonly expectedImpactText: string;
  readonly confidenceScore: number;
  readonly providingAgent: string;
}

export class ExecutiveRecommendationResolver {
  public static resolveRecommendation(ctx: Partial<ExecutiveDecisionContext> & { pageId?: string }): ExecutiveRecommendationView {
    const metrics = ctx.executiveMetrics?.currentMetrics || {};
    const company = ctx.companyName || 'Empresa';
    const period = ctx.period || '2026';

    const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
    const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 7.3;

    if (margin < 10.0) {
      const recoveryTarget = (revenue * 0.035).toFixed(0);
      return {
        recommendationText: `Reestruturar despesas operacionais e rever contratos de fornecedores para a ${company}.`,
        expectedImpactText: `Recuperação projetada de R$ ${Number(recoveryTarget).toLocaleString('pt-BR')} no fluxo de caixa operacional.`,
        confidenceScore: 98.2,
        providingAgent: 'Financial Agent Engine'
      };
    }

    if (margin >= 10.0 && margin < 15.0) {
      return {
        recommendationText: `Otimizar capital de giro e expandir alocação de caixa livre na ${company}.`,
        expectedImpactText: `Expansão estimada de +2,5 p.p. na rentabilidade líquida do exercício ${period}.`,
        confidenceScore: 96.5,
        providingAgent: 'Risk Agent Engine'
      };
    }

    return {
      recommendationText: `Aprovar plano de expansão e distribuição sustentável de dividendos para acionistas da ${company}.`,
      expectedImpactText: `Preservação da solvência patrimonial e otimização do custo de capital.`,
      confidenceScore: 99.0,
      providingAgent: 'Advisory Council Engine'
    };
  }
}
