export interface RecommendedExecutiveQuestion {
  readonly questionId: string;
  readonly promptText: string;
  readonly category: 'Diagnostic' | 'Impact' | 'Strategic' | 'Operational';
}

export class ExecutiveQuestionEngine {
  public static generateRecommendedQuestions(metricCode: string): RecommendedExecutiveQuestion[] {
    return [
      { questionId: 'q-01', promptText: `Qual produto impactou mais o indicador ${metricCode}?`, category: 'Diagnostic' },
      { questionId: 'q-02', promptText: `Existe oportunidade de reajuste tarifário/preço em ${metricCode}?`, category: 'Strategic' },
      { questionId: 'q-03', promptText: `O desvio em ${metricCode} decorre de custo ou de volume?`, category: 'Operational' },
      { questionId: 'q-04', promptText: `Qual o impacto projetado no EBITDA anual se o desvio persistir?`, category: 'Impact' }
    ];
  }
}
