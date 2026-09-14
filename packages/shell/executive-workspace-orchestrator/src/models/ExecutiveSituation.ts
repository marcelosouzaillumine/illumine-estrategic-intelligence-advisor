export interface ExecutiveSituation {
  readonly whereAmI: string;
  readonly whatChanged: string;
  readonly whatNeedsAttention: string;
  readonly highestRisk: string;
  readonly highestOpportunity: string;
  readonly explanatoryIndicators: readonly string[];
}
