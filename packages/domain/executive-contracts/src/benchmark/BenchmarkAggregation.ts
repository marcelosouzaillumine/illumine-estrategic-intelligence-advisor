export interface BenchmarkAggregation {
  readonly aggregationId: string;
  readonly industrySegment: string;
  readonly totalTenantsContributing: number; // estatísticas agregadas anônimas
  readonly metricsCount: number;
  readonly lastCalculatedAt: string;
}
