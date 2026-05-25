import { ConfidenceTelemetry } from './observability-types';

export class ConfidenceTelemetryEngine {
  private baseConfidenceScore: number = 100;
  private currentConfidenceScore: number = 100;
  private collapseReasons: string[] = [];

  private readonly CONFIDENCE_COLLAPSE_THRESHOLD = 0.45; // 45%
  private readonly CONFIDENCE_DEGRADED_THRESHOLD = 0.65; // 65%

  public setBaseConfidence(score: number) {
    this.baseConfidenceScore = score;
    this.currentConfidenceScore = score;
  }

  public applyPenalty(penaltyScore: number, reason: string) {
    this.currentConfidenceScore -= penaltyScore;
    if (this.currentConfidenceScore < 0) this.currentConfidenceScore = 0;
    this.collapseReasons.push(reason);
  }

  public getTelemetry(): ConfidenceTelemetry {
    const isDegraded = (this.currentConfidenceScore / 100) < this.CONFIDENCE_DEGRADED_THRESHOLD;
    const isCollapse = (this.currentConfidenceScore / 100) < this.CONFIDENCE_COLLAPSE_THRESHOLD;

    return {
      baseConfidenceScore: this.baseConfidenceScore,
      finalConfidenceScore: this.currentConfidenceScore,
      confidenceCollapse: isCollapse,
      collapseReasons: this.collapseReasons,
      isDegraded: isDegraded
    };
  }
}
