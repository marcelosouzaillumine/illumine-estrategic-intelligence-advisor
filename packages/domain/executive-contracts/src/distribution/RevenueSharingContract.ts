export interface RevenueSharingContract {
  readonly transactionId: string;
  readonly grossAmount: number;
  readonly platformRoyaltyAmount: number;
  readonly partnerCommissionAmount: number;
  readonly advisorShareAmount: number;
  readonly holdingOverrideAmount: number;
  readonly transactionTimestamp: string;
  readonly ledgerHash: string;
}
