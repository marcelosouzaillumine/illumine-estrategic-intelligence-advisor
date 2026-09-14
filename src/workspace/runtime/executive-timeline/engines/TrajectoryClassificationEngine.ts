// src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts

import { HistoricalRuntimeCycle, TrajectoryClassification } from '../executive-timeline-types';

export class TrajectoryClassificationEngine {
  public static classify(cycles: HistoricalRuntimeCycle[]): TrajectoryClassification {
    if (cycles.length < 3) {
      return 'INSUFFICIENT_EVIDENCE';
    }

    const latest = cycles[cycles.length - 1];
    if (latest.isQuarantined || latest.isRestricted) {
      return 'CONSTITUTIONALLY_RESTRICTED';
    }

    const scores = cycles.map(c => c.compositeScore);
    const n = scores.length;
    
    const latestScore = scores[n - 1];
    const prevScore = scores[n - 2];
    const firstScore = scores[0];

    // Determine directional movement
    let isConstantlyImproving = true;
    let isConstantlyDeteriorating = true;
    
    for (let i = 1; i < n; i++) {
      if (scores[i] < scores[i - 1]) {
        isConstantlyImproving = false;
      }
      if (scores[i] > scores[i - 1]) {
        isConstantlyDeteriorating = false;
      }
    }

    // Plateau: very little change (all scores within 5 points of each other)
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    if ((maxScore - minScore) <= 5) {
      return 'PLATEAUED';
    }

    // Heavy decline or very low composite score
    if (latestScore < 40 || (firstScore - latestScore) >= 25) {
      return 'STRUCTURALLY_DETERIORATING';
    }

    if (isConstantlyImproving && latestScore > firstScore) {
      return 'IMPROVING';
    }

    if (isConstantlyDeteriorating && latestScore < firstScore) {
      return 'DETERIORATING';
    }

    // Hibrid recovery evaluation: current score increased from previous, but previous was lower than first
    if (latestScore > prevScore && prevScore < firstScore) {
      return 'RECOVERING';
    }

    return 'STABLE';
  }
}
