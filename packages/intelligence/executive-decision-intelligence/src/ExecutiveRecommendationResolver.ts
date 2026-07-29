export interface RecommendationResolverContext {
  readonly pageId: string;
}

export interface ExecutiveRecommendationView {
  readonly recommendationText: string;
  readonly expectedImpactText: string;
  readonly confidenceScore: number;
  readonly providingAgent: string;
}

export class ExecutiveRecommendationResolver {
  public static resolveRecommendation(ctx: RecommendationResolverContext): ExecutiveRecommendationView {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return {
        recommendationText: 'Executar plano de redução de despesas operacionais não essenciais.',
        expectedImpactText: 'Recuperação estimada de R$ 1,4M na margem operacional líquida.',
        confidenceScore: 96.0,
        providingAgent: 'Financial Agent Engine'
      };
    }

    if (pageId === 'BalanceSheetPage') {
      return {
        recommendationText: 'Reorganizar o perfil do passivo financeiro e reforçar caixa livre.',
        expectedImpactText: 'Mitigação do risco de liquidez e melhoria da solvência patrimonial.',
        confidenceScore: 95.5,
        providingAgent: 'Risk Agent Engine'
      };
    }

    if (pageId === 'DFCPage') {
      return {
        recommendationText: 'Implantar programa de otimização de recebíveis e amortizações programadas.',
        expectedImpactText: 'Expansão de 15% na conversão de EBITDA em caixa operacional.',
        confidenceScore: 97.2,
        providingAgent: 'Financial Agent Engine'
      };
    }

    return {
      recommendationText: 'Aprovar o plano de ação fiduciário integrado no comitê de conselho.',
      expectedImpactText: 'Alinhamento integral entre diretoria executiva e acionistas.',
      confidenceScore: 98.5,
      providingAgent: 'Advisory Council Engine'
    };
  }
}
