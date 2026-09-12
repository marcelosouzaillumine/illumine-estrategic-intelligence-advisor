export interface DecisionLayerContext {
  readonly companyId: string;
  readonly userId: string;
  readonly pageId: string;
  readonly period: string;
  readonly activeFinancialMetrics?: Record<string, number>;
}

export interface CanonicalDecisionView {
  readonly opportunityTitle: string;
  readonly opportunityDetail: string;
  readonly anchorAgentName: string;
  readonly confidenceScore: number;
  readonly layer1Summary: string;
}

export class ExecutiveDecisionLayer {
  public static resolveDecisionView(ctx: DecisionLayerContext): CanonicalDecisionView {
    const pageId = ctx.pageId;
    const metrics = ctx.activeFinancialMetrics || {};

    if (pageId === 'DREPage') {
      const ebitda = metrics['EBITDA'] || 0;
      return {
        opportunityTitle: 'Recuperar Margem Operacional em 4.2 p.p.',
        opportunityDetail: `Análise fiduciária DRE (${ctx.period}): EBITDA atual em R$ ${ebitda.toLocaleString('pt-BR')}`,
        anchorAgentName: 'Financial Agent',
        confidenceScore: 96.5,
        layer1Summary: 'Otimização de despesas comerciais e renegociação de suprimentos.'
      };
    }

    if (pageId === 'BalanceSheetPage') {
      return {
        opportunityTitle: 'Otimizar Estrutura de Endividamento Patrimonial',
        opportunityDetail: `Análise patrimonial (${ctx.period}): Liquidez corrente e preservação de capital`,
        anchorAgentName: 'Risk Agent',
        confidenceScore: 95.0,
        layer1Summary: 'Alongamento de passivo oneroso e reforço de liquidez imediata.'
      };
    }

    if (pageId === 'DFCPage') {
      return {
        opportunityTitle: 'Maximizar Geração Operacional de Caixa (FCO)',
        opportunityDetail: `Análise de fluxos de caixa (${ctx.period}): Redução de ciclo financeiro`,
        anchorAgentName: 'Financial Agent',
        confidenceScore: 97.0,
        layer1Summary: 'Aceleração de recebíveis e amortização programada de obrigações.'
      };
    }

    return {
      opportunityTitle: 'Consolidar Diagnóstico Fiduciário Integrado',
      opportunityDetail: `Síntese corporativa (${ctx.period}): Governança e alinhamento C-Level`,
      anchorAgentName: 'Advisory Council',
      confidenceScore: 98.0,
      layer1Summary: 'Plano de ação fiduciário estratégico para o conselho de administração.'
    };
  }
}
