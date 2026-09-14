// src/core/runtime/observability/sinks/ConsoleRuntimeTelemetrySink.ts

import { RuntimeTelemetrySink, FailClosedTelemetryEvent, LatencyMetric, PayloadIntegrityCheck, LineageValidationEvent } from '../RuntimeTelemetrySink';
import { RuntimeLogEvent } from '../RuntimeExecutionLogger';
import { ExecutionTrace } from '../observability-types';

export class ConsoleRuntimeTelemetrySink implements RuntimeTelemetrySink {
  logEvent(event: RuntimeLogEvent): void {
    console.log(`[RuntimeLog] ${event.eventName}`, event);
  }
  
  saveTrace(trace: ExecutionTrace): void {
    console.log(`[RuntimeTrace] Saved Trace ${trace.executionId}`, trace);
  }
  
  getTrace(executionId: string): Promise<ExecutionTrace | null> {
    return Promise.resolve(null);
  }
  
  recordExecutionTrace(trace: ExecutionTrace): void {
    console.log(`[Telemetry] Execution Trace ${trace.executionId}`, trace);
  }
  
  recordFailClosedEvent(event: FailClosedTelemetryEvent): void {
    console.warn(`[Telemetry] Fail-Closed Triggered: ${event.trigger}`, event);
  }
  
  recordLatencyMetric(metric: LatencyMetric): void {
    console.debug(`[Telemetry] Latency Metric: ${metric.stage} = ${metric.durationMs}ms`);
  }
  
  recordPayloadIntegrityCheck(check: PayloadIntegrityCheck): void {
    console.info(`[Telemetry] Payload Integrity Check: ${check.isValid ? 'PASSED' : 'FAILED'}`, check);
  }
  
  recordLineageValidation(validation: LineageValidationEvent): void {
    console.info(`[Telemetry] Lineage Validation: ${validation.isValid ? 'PASSED' : 'FAILED'}`, validation);
  }
  
  async flush(): Promise<void> {
    console.log('[Telemetry] Flushed Console Sink');
  }
}
