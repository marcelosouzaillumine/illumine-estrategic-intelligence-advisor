export interface DecisionTrustContract {
  readonly decisionId: string;
  readonly companyId: string;
  readonly overallConfidenceScore: number;
  readonly confidenceBreakdown: {
    readonly dataQualityScore: number;
    readonly historicalVolumeScore: number;
    readonly benchmarkCoverageScore: number;
    readonly trendStabilityScore: number;
    readonly councilConsensusScore: number;
    readonly knowledgeGraphMatchScore: number;
  };
  readonly riskScores: {
    readonly financialRiskScore: number;
    readonly operationalRiskScore: number;
    readonly strategicRiskScore: number;
    readonly executionRiskScore: number;
    readonly dataRiskScore: number;
    readonly forecastRiskScore: number;
  };
  readonly dominantKPIs: readonly string[];
  readonly assumedHypotheses: readonly string[];
  readonly confidenceDepreciatingFactors: readonly string[];
  readonly timestamp: string;
}
