import { ConfidenceTelemetry } from './observability-types';
import { CalibrationEngine } from '../../../core/runtime/calibration/CalibrationEngine';

export class ConfidenceTelemetryEngine {
  private baseConfidenceScore: number = 100;
  private currentConfidenceScore: number = 100;
  private collapseReasons: string[] = [];

  private get CONFIDENCE_COLLAPSE_THRESHOLD() {
    return CalibrationEngine.getCalibration().confidenceCollapseThreshold;
  }

  private get CONFIDENCE_DEGRADED_THRESHOLD() {
    return CalibrationEngine.getCalibration().confidenceDegradedThreshold;
  }

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
