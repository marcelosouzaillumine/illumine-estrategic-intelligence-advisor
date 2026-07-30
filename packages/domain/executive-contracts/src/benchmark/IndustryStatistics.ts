export interface IndustryStatistics {
  readonly metricCode: string;
  readonly sampleSize: number;
  readonly mean: number;
  readonly median: number;
  readonly p10: number;
  readonly p25: number;
  readonly p50: number;
  readonly p75: number;
  readonly p90: number;
  readonly dataFreshnessDate: string;
  readonly confidenceScore: number;
}
