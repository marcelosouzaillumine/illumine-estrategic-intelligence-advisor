export interface BenchmarkQuery {
  readonly metricCode: string;
  readonly industrySegment: string;
  readonly companySize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  readonly region?: string;
  readonly businessModel?: string;
  readonly revenueBracket?: string;
  readonly employeeCountRange?: string;
  readonly managementMaturity?: 'EMERGING' | 'STRUCTURED' | 'ADVANCED';
}
