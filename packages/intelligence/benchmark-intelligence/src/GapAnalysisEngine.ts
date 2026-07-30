export interface PerformanceBaseline {
  readonly baselineId: string;
  readonly metricCode: string;
  readonly historicalAverage: number;
  readonly strategicTarget: number;
  readonly period: string;
}

export interface GapAnalysisResult {
  readonly gapToBaseline: number;
  readonly gapToTarget: number;
  readonly status: 'BEHIND_TARGET' | 'ON_TARGET' | 'EXCEEDING_TARGET';
}

export class GapAnalysisEngine {
  public static evaluateGap(baseline: PerformanceBaseline, currentValue: number): GapAnalysisResult {
    const gapToBaseline = Number((currentValue - baseline.historicalAverage).toFixed(1));
    const gapToTarget = Number((currentValue - baseline.strategicTarget).toFixed(1));
    
    let status: 'BEHIND_TARGET' | 'ON_TARGET' | 'EXCEEDING_TARGET' = 'ON_TARGET';
    if (gapToTarget < 0) status = 'BEHIND_TARGET';
    else if (gapToTarget > 0) status = 'EXCEEDING_TARGET';

    return {
      gapToBaseline,
      gapToTarget,
      status
    };
  }
}
