import { RuntimeTelemetryData } from '../../../core/runtime/performance/types';
import { runtimeMetricsAggregator } from './RuntimeMetricsAggregator';
import { TelemetryAuditTrail } from './TelemetryAuditTrail';

export class RuntimeTelemetryEngine {
  static startTelemetrySession(tenantId: string, executionId: string, correlationId: string, runtimeScope: string, topologyScope: string) {
    runtimeMetricsAggregator.startExecution(executionId);
    return {
      tenantId,
      executionId,
      correlationId,
      runtimeScope,
      topologyScope,
      startTime: Date.now()
    };
  }

  static endTelemetrySession(session: ReturnType<typeof RuntimeTelemetryEngine.startTelemetrySession>) {
    const metrics = runtimeMetricsAggregator.getMetrics(session.executionId);
    if (!metrics) return;

    metrics.executionTimeMs = Date.now() - session.startTime;

    const data: RuntimeTelemetryData = {
      tenantId: session.tenantId,
      executionId: session.executionId,
      correlationId: session.correlationId,
      runtimeScope: session.runtimeScope,
      topologyScope: session.topologyScope,
      metrics: { ...metrics },
      timestamp: new Date().toISOString()
    };

    TelemetryAuditTrail.logTelemetry(data);
    runtimeMetricsAggregator.finalizeExecution(session.executionId);
    return data;
  }
}
