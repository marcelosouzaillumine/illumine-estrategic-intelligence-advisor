export interface ActiveInteractionContext {
  readonly activeMetric?: string;
  readonly activeInsightId?: string;
  readonly activeRecommendationText?: string;
  readonly currentPage: string;
}

export class CopilotContextResolver {
  public static resolveActiveContext(
    currentPage: string,
    activeMetric?: string,
    activeInsightId?: string,
    activeRecommendationText?: string
  ): ActiveInteractionContext {
    return {
      currentPage,
      activeMetric,
      activeInsightId,
      activeRecommendationText
    };
  }
}
