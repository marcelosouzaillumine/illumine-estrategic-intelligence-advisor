export type RiskCategory = 'DEPENDENCY' | 'BOUNDARY' | 'EVOLUTION' | 'CERTIFICATION';
export type RiskConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskSignal {
  readonly id: string;
  readonly category: RiskCategory;
  readonly sourceSignalId: string;
  readonly evidence: readonly string[];
  readonly magnitude: number;
  readonly confidence: RiskConfidence;
}
