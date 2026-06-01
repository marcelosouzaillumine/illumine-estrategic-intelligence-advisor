import { RuntimeTelemetrySink } from './RuntimeTelemetrySink';
import { ConsoleRuntimeTelemetrySink } from './sinks/ConsoleRuntimeTelemetrySink';

export type RuntimeEventName = 
  | 'RUNTIME_STARTED'
  | 'DATA_VALIDATION_STARTED'
  | 'DATA_VALIDATION_FAILED'
  | 'CONSOLIDATION_STARTED'
  | 'CONSOLIDATION_COMPLETED'
  | 'ADVISORY_STARTED'
  | 'ADVISORY_COMPLETED'
  | 'CONFIDENCE_DEGRADED'
  | 'GOVERNANCE_BLOCK_TRIGGERED'
  | 'EXECUTION_FAILED'
  | 'EXECUTION_COMPLETED';

export interface RuntimeLogEvent {
  id: string;
  executionId: string;
  eventName: RuntimeEventName;
  timestamp: string;
  metadata?: Record<string, unknown>;
  payloadIntegrityHash?: string;
  latencyMs?: number;
}

export class RuntimeExecutionLogger {
  private static activeSink: RuntimeTelemetrySink = new ConsoleRuntimeTelemetrySink();

  public static setSink(sink: RuntimeTelemetrySink) {
    this.activeSink = sink;
  }

  static async logEvent(executionId: string, eventName: RuntimeEventName, metadata?: Record<string, unknown>, latencyMs?: number): Promise<void> {
    try {
      let id = `${executionId}_${eventName}_${Date.now()}`;
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      }
      
      const event: RuntimeLogEvent = {
        id,
        executionId,
        eventName,
        timestamp: new Date().toISOString(),
        metadata,
        latencyMs
      };
      
      await this.activeSink.logEvent(event);
    } catch (err) {
      console.error('[RuntimeExecutionLogger] Failed to log event:', err);
    }
  }
}
