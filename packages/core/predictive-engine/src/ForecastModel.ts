import { Identifier } from '@illumine/core-primitives';
import { PredictionExplanation } from './PredictionExplanation';
import { PredictionCalibration } from './PredictionCalibration';

export interface ForecastModel {
  readonly forecastId: Identifier;
  readonly metricCode: string;
  readonly expectedValue: number;
  readonly pessimisticValue: number;
  readonly optimisticValue: number;
  readonly explanation: PredictionExplanation;
  readonly calibration?: PredictionCalibration;
}
