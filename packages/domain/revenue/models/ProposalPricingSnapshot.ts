export interface ProposalPricingSnapshot {
  currency: string;
  amount: number;
  billingCycle: 'monthly' | 'annual';
  planId: string;
  addons: string[];
  capturedAt: string;
}
