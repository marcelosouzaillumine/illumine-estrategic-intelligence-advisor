export interface Recommendation {
  readonly id: string;
  readonly subject: string;
  readonly statement: string;
  readonly rationale: readonly string[];
  readonly supportingEvidence: readonly string[];
  readonly alternatives: readonly string[];
  readonly confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  readonly requiresHumanDecision: true;
}
