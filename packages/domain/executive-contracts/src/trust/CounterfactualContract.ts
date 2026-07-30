export interface CounterfactualContract {
  readonly analysisId: string;
  readonly baseMetricCode: string;
  readonly baseValue: number;
  readonly counterfactualValue: number;
  readonly deltaDeltaPoints: number;
  readonly wouldDecisionChange: boolean;
  readonly alteredCouncilRecommendation?: string;
  readonly sensitiveVariable: string;
}
