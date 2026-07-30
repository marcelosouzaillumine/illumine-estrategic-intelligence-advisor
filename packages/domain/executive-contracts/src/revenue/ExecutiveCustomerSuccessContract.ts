export interface ExecutiveCustomerSuccessContract {
  readonly csId: string;
  readonly companyName: string;
  readonly healthScore: number; // 0 to 100
  readonly engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  readonly churnRiskPercent: number;
  readonly acceptedRecommendationsCount: number;
  readonly expansionOpportunityValue: number;
}
