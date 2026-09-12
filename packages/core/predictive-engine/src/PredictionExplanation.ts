import { Score, Confidence } from '@illumine/core-primitives';

export interface PredictionExplanation {
  readonly primaryDrivers: string[];
  readonly identifiedRisks: string[];
  readonly confidence: Confidence;
  readonly explainabilityScore: Score;
  readonly narrativeSummary: string;
}
