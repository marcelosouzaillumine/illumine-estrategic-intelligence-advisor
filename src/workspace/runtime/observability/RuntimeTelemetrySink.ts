// src/core/runtime/observability/RuntimeTelemetrySink.ts

import { ExecutionTrace } from './observability-types';
import { RuntimeLogEvent } from './RuntimeExecutionLogger';

export interface FailClosedTelemetryEvent {
  executionId: string;
  trigger: string;
  timestamp: string;
  severity: string;
  affectedRuntimes: string[];
}

export interface LatencyMetric {
  executionId: string;
  stage: string;
  durationMs: number;
  timestamp: string;
}

export interface PayloadIntegrityCheck {
  executionId: string;
  lineageHash: string;
  isValid: boolean;
  violations: string[];
  timestamp: string;
}

export interface LineageValidationEvent {
  executionId: string;
  lineageHash: string;
  parentHashes: string[];
  isValid: boolean;
  timestamp: string;
}

export interface RuntimeTelemetrySink {
  // Legacy support for existing logger
  logEvent(event: RuntimeLogEvent): Promise<void> | void;
  saveTrace(trace: ExecutionTrace): Promise<void> | void;
  getTrace(executionId: string): Promise<ExecutionTrace | null>;
  
  // Strict canonical interface
  recordExecutionTrace(trace: ExecutionTrace): Promise<void> | void;
  recordFailClosedEvent(event: FailClosedTelemetryEvent): Promise<void> | void;
  recordLatencyMetric(metric: LatencyMetric): Promise<void> | void;
  recordPayloadIntegrityCheck(check: PayloadIntegrityCheck): Promise<void> | void;
  recordLineageValidation(validation: LineageValidationEvent): Promise<void> | void;
  flush?(): Promise<void>;
}
