export interface PageQuestionPayload {
  readonly pageContext: string;
  readonly businessContext: string;
  readonly selectedPeriod: string;
  readonly activeFilters: Record<string, string>;
  readonly userRole: string;
  readonly relevantKPIs: string[];
  readonly questionPrompt: string;
}

export class ContextualQuestionMenu {
  public static getMenuOptions(pageContext: string): string[] {
    return [
      'Explique os indicadores',
      'Quais são os principais riscos?',
      'Quais oportunidades existem?',
      'Quais decisões devo tomar?',
      'Compare com período anterior',
      'Fazer uma pergunta livre'
    ];
  }
}

export class PageQuestionLauncher {
  public static launchQuestion(
    questionPrompt: string,
    pageContext: string,
    userRole: string,
    relevantKPIs: string[]
  ): PageQuestionPayload {
    return {
      pageContext,
      businessContext: `Diagnóstico executivo de ${pageContext}`,
      selectedPeriod: '2026-YTD',
      activeFilters: { page: pageContext },
      userRole,
      relevantKPIs,
      questionPrompt
    };
  }
}
