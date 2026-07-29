export interface CopilotLayerContext {
  readonly companyName: string;
  readonly pageId: string;
  readonly activeMetric?: string;
}

export interface CopilotOpeningView {
  readonly greetingText: string;
  readonly suggestedQuestions: readonly string[];
}

export class ExecutiveCopilotLayer {
  public static resolveInitialCopilotState(ctx: CopilotLayerContext): CopilotOpeningView {
    const pageId = ctx.pageId;
    const company = ctx.companyName || 'Empresa';

    if (pageId === 'DREPage') {
      return {
        greetingText: `Ambiente DRE de ${company} identificado. Posso analisar variação de despesas, margem EBITDA ou simular cenários de resultado.`,
        suggestedQuestions: [
          'Quais os principais causadores da variação de margem?',
          'Como otimizar custos operacionais no próximo trimestre?',
          'Qual o impacto de uma redução de 5% nas despesas gerais?'
        ]
      };
    }

    if (pageId === 'BalanceSheetPage') {
      return {
        greetingText: `Balanço Patrimonial de ${company} carregado. Posso diagnosticar índices de liquidez, estrutura de capital e risco de endividamento.`,
        suggestedQuestions: [
          'Qual a posição atual de liquidez corrente?',
          'Como otimizar a estrutura de endividamento oneroso?',
          'Existe necessidade de aporte de capital de giro?'
        ]
      };
    }

    return {
      greetingText: `Inteligência Executiva ativada para ${company}. Como posso apoiar sua decisão hoje?`,
      suggestedQuestions: [
        'Apresentar síntese fiduciária do período',
        'Quais os principais riscos identificados pelos agentes?',
        'Solicitar recomendação ao Conselho de Administração'
      ]
    };
  }
}
