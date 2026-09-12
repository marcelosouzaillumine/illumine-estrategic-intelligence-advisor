import { Recommendation } from '../models/Recommendation';

export interface RecommendationSnapshot {
  readonly version: string;
  readonly generatedAt: string;
  readonly recommendations: readonly Recommendation[];
}

export class RecommendationSnapshotGenerator {
  generate(recommendations: Recommendation[]): RecommendationSnapshot {
    return {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      recommendations
    };
  }
}
