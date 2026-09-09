export interface ExpansionOpportunity {
  recommendedSuite: 'Governance Governance' | 'Strategic Advisory AI' | 'Vertical Governance';
  probabilityPercentage: number;
  potentialEbitdaGainBrl: number;
  reasoning: string;
}

export class ExpansionRecommendationEngine {
  public static recommendExpansion(tenantId: string): ExpansionOpportunity[] {
    return [
      {
        recommendedSuite: 'Governance Governance',
        probabilityPercentage: 92,
        potentialEbitdaGainBrl: 450000,
        reasoning: 'Alta maturidade no módulo Executive Governance e expansão recomendada para Conselho Digital e Matriz RACI.'
      }
    ];
  }
}
