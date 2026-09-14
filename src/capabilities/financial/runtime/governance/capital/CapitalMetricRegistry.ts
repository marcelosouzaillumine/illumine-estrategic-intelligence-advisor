export interface CapitalMetric {
  metricId: string;
  sourceStatement: string;
  sourceAccount: string;
  sourceValue: number | string | null;
  consumedValue: number | string | null;
  renderedValue: number | string | null;
  lineageStatus: 'CONSISTENT' | 'INCONSISTENT' | 'NOT_RENDERED' | 'MISSING_SOURCE' | 'NOT_OBSERVABLE';
}

export class CapitalMetricRegistry {
  private metrics: Map<string, CapitalMetric> = new Map();

  registerMetric(metric: CapitalMetric) {
    this.metrics.set(metric.metricId, metric);
  }

  getMetric(metricId: string): CapitalMetric | undefined {
    return this.metrics.get(metricId);
  }

  getAllMetrics(): CapitalMetric[] {
    return Array.from(this.metrics.values());
  }

  clear() {
    this.metrics.clear();
  }
}
