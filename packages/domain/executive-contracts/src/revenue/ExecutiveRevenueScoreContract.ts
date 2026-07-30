export interface ExecutiveRevenueScoreContract {
  readonly ersScoreId: string;
  readonly companyId: string;
  readonly ersOverallScore: number; // 0 to 100
  readonly mrrValue: number;
  readonly arrValue: number;
  readonly cacPaybackMonths: number;
  readonly winRatePercent: number;
  readonly evaluatedAt: string;
}

export * from './ExecutiveCRMContract';
export * from './ExecutiveProposalContract';
export * from './ExecutiveROIContract';
export * from './ExecutiveCustomerSuccessContract';
export * from './ExecutivePartnerContract';
