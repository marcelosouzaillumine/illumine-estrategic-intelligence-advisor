export interface PercentileCalculation {
  readonly metricCode: string;
  readonly companyValue: number;
  readonly percentile: number; // ex: 38 (P38)
  readonly medianValue: number;
  readonly gapPoints: number; // ex: -6 (6 p.p. abaixo)
  readonly confidenceScore: number;
  readonly sampleSize: number;
  readonly representativeness: string;
}
