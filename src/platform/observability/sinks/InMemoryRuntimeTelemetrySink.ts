// src/core/runtime/observability/sinks/InMemoryRuntimeTelemetrySink.ts

import { RuntimeTelemetrySink, FailClosedTelemetryEvent, LatencyMetric, PayloadIntegrityCheck, LineageValidationEvent } from '../RuntimeTelemetrySink';
import { RuntimeLogEvent } from '../RuntimeExecutionLogger';
import { ExecutionTrace } from '../observability-types';

export class InMemoryRuntimeTelemetrySink implements RuntimeTelemetrySink {
  public logEvents: RuntimeLogEvent[] = [];
  public traces: ExecutionTrace[] = [];
  public failClosedEvents: FailClosedTelemetryEvent[] = [];
  public latencyMetrics: LatencyMetric[] = [];
  public payloadIntegrityChecks: PayloadIntegrityCheck[] = [];
  public lineageValidations: LineageValidationEvent[] = [];

  logEvent(event: RuntimeLogEvent): void {
    this.logEvents.push(event);
  }
  
  saveTrace(trace: ExecutionTrace): void {
    this.traces.push(trace);
  }
  
  getTrace(executionId: string): Promise<ExecutionTrace | null> {
    return Promise.resolve(this.traces.find(t => t.executionId === executionId) || null);
  }
  
  recordExecutionTrace(trace: ExecutionTrace): void {
    this.traces.push(trace);
  }
  
  recordFailClosedEvent(event: FailClosedTelemetryEvent): void {
    this.failClosedEvents.push(event);
  }
  
  recordLatencyMetric(metric: LatencyMetric): void {
    this.latencyMetrics.push(metric);
  }
  
  recordPayloadIntegrityCheck(check: PayloadIntegrityCheck): void {
    this.payloadIntegrityChecks.push(check);
  }
  
  recordLineageValidation(validation: LineageValidationEvent): void {
    this.lineageValidations.push(validation);
  }
  
  async flush(): Promise<void> {}

  clear(): void {
    this.logEvents = [];
    this.traces = [];
    this.failClosedEvents = [];
    this.latencyMetrics = [];
    this.payloadIntegrityChecks = [];
    this.lineageValidations = [];
  }
}
