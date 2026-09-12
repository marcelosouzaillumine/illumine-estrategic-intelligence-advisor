import { RuntimeTelemetryData } from '../../core/runtime/performance/types';

export class RuntimeMetricsAggregator {
  private activeExecutions: Map<string, Partial<RuntimeTelemetryData['metrics']>> = new Map();

  startExecution(executionId: string) {
    this.activeExecutions.set(executionId, {
      executionTimeMs: 0,
      orchestrationDepth: 0,
      memoryUsageBytes: 0,
      cacheHitRatio: 0,
      propagationCostMs: 0,
      stressExecutionCostMs: 0,
      runtimeSaturationPercent: 0,
      tenantExecutionLoadPercent: 0
    });
  }

  updateMetrics(executionId: string, partialMetrics: Partial<RuntimeTelemetryData['metrics']>) {
    const existing = this.activeExecutions.get(executionId);
    if (existing) {
      this.activeExecutions.set(executionId, { ...existing, ...partialMetrics });
    }
  }

  getMetrics(executionId: string): RuntimeTelemetryData['metrics'] | undefined {
    return this.activeExecutions.get(executionId) as RuntimeTelemetryData['metrics'];
  }

  finalizeExecution(executionId: string) {
    this.activeExecutions.delete(executionId);
  }
}

export const runtimeMetricsAggregator = new RuntimeMetricsAggregator();
