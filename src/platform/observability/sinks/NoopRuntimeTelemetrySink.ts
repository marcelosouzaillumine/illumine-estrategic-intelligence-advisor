// src/core/runtime/observability/sinks/NoopRuntimeTelemetrySink.ts

import { RuntimeTelemetrySink, FailClosedTelemetryEvent, LatencyMetric, PayloadIntegrityCheck, LineageValidationEvent } from '../RuntimeTelemetrySink';
import { RuntimeLogEvent } from '../RuntimeExecutionLogger';
import { ExecutionTrace } from '../observability-types';

export class NoopRuntimeTelemetrySink implements RuntimeTelemetrySink {
  logEvent(event: RuntimeLogEvent): void {}
  saveTrace(trace: ExecutionTrace): void {}
  getTrace(executionId: string): Promise<ExecutionTrace | null> { return Promise.resolve(null); }
  
  recordExecutionTrace(trace: ExecutionTrace): void {}
  recordFailClosedEvent(event: FailClosedTelemetryEvent): void {}
  recordLatencyMetric(metric: LatencyMetric): void {}
  recordPayloadIntegrityCheck(check: PayloadIntegrityCheck): void {}
  recordLineageValidation(validation: LineageValidationEvent): void {}
  async flush(): Promise<void> {}
}
