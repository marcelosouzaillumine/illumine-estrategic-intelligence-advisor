export type ForecastHorizonDays = 30 | 60 | 90 | 180 | 365;

export interface PredictionContract {
  readonly predictionId: string;
  readonly metricCode: string;
  readonly currentValue: number;
  readonly horizonDays: ForecastHorizonDays;
  readonly expectedValue: number;
  readonly confidenceInterval: { readonly min: number; readonly max: number };
  readonly trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  readonly changeVelocityPercent: number;
  readonly volatilityPercent: number;
  readonly probabilityPercent: number;
  readonly dominantFactor: string;
  readonly confidenceScore: number;
  readonly timestamp: string;
}
