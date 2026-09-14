import { InstitutionalWisdomObject } from '@illumine/executive-contracts';

export class DecisionCalibrationEngine {
  public static calculateCalibratedWeight(initialWeight: number, wisdom: InstitutionalWisdomObject): number {
    const newWeight = initialWeight + wisdom.confidenceAdjustment;
    return parseFloat(Math.min(1.0, Math.max(0.1, newWeight)).toFixed(2));
  }
}
