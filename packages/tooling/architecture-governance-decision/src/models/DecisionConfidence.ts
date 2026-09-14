export interface DecisionConfidence {
  readonly decisionConfidence: number; // 0-100
  readonly evidenceConfidence: number; // 0-100
  readonly contextCompleteness: number; // 0-100
  readonly observationReliability: number; // 0-100
  readonly knowledgeCoverage: number; // 0-100
  readonly constitutionalCompliance: number; // 0-100
}
