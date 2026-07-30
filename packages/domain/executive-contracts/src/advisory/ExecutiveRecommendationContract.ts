export interface ExecutiveRecommendationAlternative {
  readonly alternativeId: string;
  readonly title: string;
  readonly description: string;
  readonly expectedImpact: number;
  readonly riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ExecutiveRecommendationContract {
  readonly recommendationId: string;
  readonly originatingDecision: string;
  readonly diagnosis: string;
  readonly alternatives: readonly ExecutiveRecommendationAlternative[];
  readonly selectedRecommendation: string;
  readonly expectedImpact: number;
  readonly expectedKPIShift: string;
  readonly confidence: number;
  readonly assumptions: readonly string[];
  readonly risks: readonly string[];
}
