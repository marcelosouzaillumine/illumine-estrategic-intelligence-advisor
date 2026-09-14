export class BenchmarkAuditLogger {
  private static logs: any[] = [];

  static logEvent(
    event: 'BENCHMARK_EXECUTED' | 'COHORT_CREATED' | 'PRIVACY_BLOCKED' | 'AGGREGATION_COMPLETED' | 'BENCHMARK_DENIED' | 'PATTERN_ANALYZED',
    cohortSignature: string,
    details: string
  ) {
    const record = {
      auditId: `BMK-AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      event,
      cohortSignature,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.logs.push(record);
    console.log(`[BenchmarkAuditLogger] ${event} - Cohort: ${cohortSignature} | ${details}`);
  }

  static getLogs(): any[] {
    return [...this.logs];
  }
}
