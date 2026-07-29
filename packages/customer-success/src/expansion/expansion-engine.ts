export interface ExpansionOpportunity {
  recommendedSuite: 'Governance Intelligence' | 'Strategic Advisory AI' | 'Vertical Intelligence';
  probabilityPercentage: number;
  potentialEbitdaGainBrl: number;
  reasoning: string;
}

export class ExpansionRecommendationEngine {
  public static recommendExpansion(tenantId: string): ExpansionOpportunity[] {
    return [
      {
        recommendedSuite: 'Governance Intelligence',
        probabilityPercentage: 92,
        potentialEbitdaGainBrl: 450000,
        reasoning: 'Alta maturidade no módulo Executive Intelligence e expansão recomendada para Conselho Digital e Matriz RACI.'
      }
    ];
  }
}
