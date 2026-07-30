export interface ExecutiveProposalContract {
  readonly proposalId: string;
  readonly companyName: string;
  readonly scopeSummary: string;
  readonly annualInvestmentValue: number;
  readonly projectedEbitdaGain: number;
  readonly projectedPaybackMonths: number;
  readonly generatedAt: string;
  readonly status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
}
