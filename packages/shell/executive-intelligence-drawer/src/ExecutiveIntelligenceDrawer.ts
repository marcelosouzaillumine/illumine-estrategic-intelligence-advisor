export interface DrawerState {
  readonly isOpen: boolean;
  readonly activeTab: 'Insights' | 'Evidence' | 'Recommendations' | 'Questions';
  readonly pageContext: string;
  readonly preservedFilters: Record<string, string>;
}

export class InsightExplorer {
  public static getInsights(pageContext: string): string[] {
    return [`Detecção de variação em ${pageContext}`, 'Oportunidade de otimização identificada'];
  }
}

export class EvidencePanel {
  public static getEvidences(pageContext: string): string[] {
    return [`Evidência 1: Variação de custo em ${pageContext}`, 'Evidência 2: Histórico de DRE'];
  }
}

export class RecommendationPanel {
  public static getRecommendations(pageContext: string): string[] {
    return [`Recomendação 1: Reorganizar matriz de despesas em ${pageContext}`];
  }
}

export class ExecutiveIntelligenceDrawer {
  public static open(pageContext: string, filters: Record<string, string>): DrawerState {
    return {
      isOpen: true,
      activeTab: 'Insights',
      pageContext,
      preservedFilters: filters
    };
  }
}
