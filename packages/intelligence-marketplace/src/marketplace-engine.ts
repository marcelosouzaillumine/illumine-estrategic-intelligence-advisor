export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'TEMPLATE' | 'FINANCIAL_MODEL' | 'PLAYBOOK' | 'BENCHMARK';
  author: string;
  rating: number;
  approvedForDistribution: true;
}

export class IntelligenceMarketplaceEngine {
  public static listFeaturedItems(): MarketplaceItem[] {
    return [
      {
        id: 'mp-001',
        title: 'Playbook de Reestruturação de Capital de Giro para Indústrias',
        category: 'PLAYBOOK',
        author: 'Illumine Senior Advisory Board',
        rating: 4.9,
        approvedForDistribution: true
      }
    ];
  }
}
