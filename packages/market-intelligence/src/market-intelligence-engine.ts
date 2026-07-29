export interface MarketTrend {
  id: string;
  indicator: string;
  trend: 'UPWARD' | 'STABLE' | 'DOWNWARD';
  impactDescription: string;
}

export class MarketIntelligenceEngine {
  public static getMarketTrends(): MarketTrend[] {
    return [
      {
        id: 'trd-001',
        indicator: 'Taxa Selic Projetada Q4',
        trend: 'DOWNWARD',
        impactDescription: 'Redução do custo financeiro de dívidas atreladas ao CDI.'
      }
    ];
  }
}
