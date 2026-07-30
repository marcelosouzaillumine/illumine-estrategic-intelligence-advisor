export interface ExecutiveTrustContract {
  readonly trustId: string;
  readonly companyId: string;
  readonly tttdSecondsToFirstTrust: number; // Time to Trusted Decision
  readonly trustScore: number; // 0 to 100
  readonly recommendationAcceptanceRatePercent: number;
}
