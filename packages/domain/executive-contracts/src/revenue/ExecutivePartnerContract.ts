export interface ExecutivePartnerContract {
  readonly partnerId: string;
  readonly partnerName: string;
  readonly tier: 'PLATINUM' | 'GOLD' | 'SILVER';
  readonly totalReferralsCount: number;
  readonly accruedCommissionsValue: number;
  readonly activeSharedPipelineValue: number;
}
