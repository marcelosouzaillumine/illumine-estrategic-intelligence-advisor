export interface IntelligenceObservabilityContract {
  readonly traceId: string;
  readonly executionChain: readonly string[];
  readonly confidenceEvolution: readonly number[];
  readonly wisdomAppliedCount: number;
  readonly policyDecisionStatus: string;
  readonly totalExecutionTimeMs: number;
  readonly timestamp: string;
}
