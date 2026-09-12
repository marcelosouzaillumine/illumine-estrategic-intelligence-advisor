export interface DecisionExplainabilityReport {
  readonly id: string;
  readonly decisionId: string;
  readonly why: string;
  readonly evidence: readonly string[]; // IDs
  readonly rulesAndConstitution: readonly string[]; // IDs or references
  readonly counterfactualAnalysis: string; // What would happen if the opposite decision was taken?
  readonly alternativesDiscarded: readonly string[];
  readonly expectedResult: string;
  readonly observedResult?: string; // Captured later in the lineage
}
