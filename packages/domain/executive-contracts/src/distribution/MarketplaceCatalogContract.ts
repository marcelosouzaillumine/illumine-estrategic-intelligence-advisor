export type MarketplaceItemType = 'ADVISOR_SERVICE' | 'DIAGNOSTIC_FRAMEWORK' | 'EXECUTIVE_PLAYBOOK' | 'AUDIT_SUITE' | 'CERTIFICATION_COURSE';

export interface MarketplaceCatalogContract {
  readonly itemId: string;
  readonly title: string;
  readonly category: MarketplaceItemType;
  readonly publisherPartnerId: string;
  readonly priceValue: number;
  readonly currency: string;
  readonly ratingScore: number;
  readonly salesCount: number;
}
