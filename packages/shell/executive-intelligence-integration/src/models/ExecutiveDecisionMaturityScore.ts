export interface ExecutiveDecisionMaturityScore {
  readonly scoreId: string;
  readonly decisionId: string;
  readonly overallScore: number; // 0 to 100
  readonly dimensions: {
    readonly evidenceQuality: number;
    readonly contextCompleteness: number;
    readonly decisionTraceability: number;
    readonly outcomeMonitoring: number;
    readonly learningGeneration: number;
  };
}
