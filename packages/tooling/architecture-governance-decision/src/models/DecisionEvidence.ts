export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DecisionEvidence {
  readonly id: string;
  readonly source: string;
  readonly type: string;
  readonly snapshot: string;
  readonly artifact: string;
  readonly confidence: ConfidenceLevel;
}
