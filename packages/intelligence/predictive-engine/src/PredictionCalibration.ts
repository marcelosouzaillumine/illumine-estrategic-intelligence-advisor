import { Identifier } from '@illumine/core-primitives';

export interface PredictionCalibration {
  readonly calibrationId: Identifier;
  readonly forecastId: Identifier;
  readonly predictedValue: number;
  readonly actualValue?: number;
  readonly deviation?: number;
  readonly confidenceAdjustment?: number;
}
