export interface AdvisorRecommendationContract {
  readonly recommendationId: string;
  readonly companyId: string;
  readonly recommendedAdvisorId: string;
  readonly matchConfidencePercent: number;
  readonly reasoningJustification: string;
  readonly benchmarkCorrelationScore: number;
}
