import { PerformanceBaseline } from './PerformanceBaseline';

export interface GapAnalysisResult {
  readonly metricCode: string;
  readonly currentValue: number;
  readonly gapToBaseline: number;
  readonly gapToTarget: number;
  readonly status: 'ABOVE_TARGET' | 'ON_TRACK' | 'BEHIND_TARGET' | 'CRITICAL_GAP';
}

export class GapAnalysisEngine {
  public static evaluateGap(baseline: PerformanceBaseline, currentValue: number): GapAnalysisResult {
    const gapToBaseline = currentValue - baseline.historicalAverage;
    const gapToTarget = currentValue - baseline.strategicTarget;

    let status: GapAnalysisResult['status'] = 'ON_TRACK';
    if (gapToTarget >= 0) status = 'ABOVE_TARGET';
    else if (gapToTarget < -5) status = 'CRITICAL_GAP';
    else if (gapToTarget < 0) status = 'BEHIND_TARGET';

    return {
      metricCode: baseline.metricCode,
      currentValue,
      gapToBaseline,
      gapToTarget,
      status
    };
  }
}
