export interface DecisionNarrativeContext {
  readonly pageId: string;
  readonly period: string;
}

export interface DecisionNarrativeView {
  readonly executiveHeadline: string;
  readonly probableCause: string;
  readonly financialImplication: string;
}

export class ExecutiveDecisionNarrativeResolver {
  public static resolveNarrative(ctx: DecisionNarrativeContext): DecisionNarrativeView {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return {
        executiveHeadline: 'Desempenho operacional sob pressão de custos variáveis no ciclo recente.',
        probableCause: 'Expansão de 18% em despesas comerciais e logísticas.',
        financialImplication: 'Compressão do retorno sobre receita líquida e redução no lucro distribuível.'
      };
    }

    if (pageId === 'BalanceSheetPage') {
      return {
        executiveHeadline: 'Estrutura patrimonial preservada, porém com maior exposição de curto prazo.',
        probableCause: 'Concentração de vencimentos de dívida em 12 meses.',
        financialImplication: 'Risco de refinanciamento caso a geração interna de caixa arrefecer.'
      };
    }

    return {
      executiveHeadline: 'Síntese fiduciária consolidada atesta estabilidade institucional e de governança.',
      probableCause: 'Consistência no cumprimento de diretrizes do conselho de administração.',
      financialImplication: 'Manutenção do valuation da empresa e sólida reputação de mercado.'
    };
  }
}
