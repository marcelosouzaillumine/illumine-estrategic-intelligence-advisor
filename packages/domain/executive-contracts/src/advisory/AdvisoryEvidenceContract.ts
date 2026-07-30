export interface AdvisoryEvidenceContract {
  readonly evidenceId: string;
  readonly evidenceSources: readonly string[];
  readonly confidenceScore: number;
  readonly evidenceFreshnessScore: number;
  readonly expectedImpact: string;

  readonly riskAssessment: string;
  readonly counterArguments: readonly string[]; // "Por que esta recomendação pode estar errada?"
  readonly supportingWisdomIds: readonly string[];
}
