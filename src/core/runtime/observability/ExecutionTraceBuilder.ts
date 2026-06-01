import { ExecutionTrace, RuntimeReplayEnvelope } from './observability-types';
import { RuntimeTelemetrySink } from './RuntimeTelemetrySink';
import { ConsoleRuntimeTelemetrySink } from './sinks/ConsoleRuntimeTelemetrySink';

export class ExecutionTraceBuilder {
  private trace: ExecutionTrace;
  private currentStageStart: number = 0;
  private currentStageName: string = '';
  private static activeSink: RuntimeTelemetrySink = new ConsoleRuntimeTelemetrySink();

  public static setSink(sink: RuntimeTelemetrySink) {
    this.activeSink = sink;
  }

  constructor(executionId: string) {
    this.trace = {
      executionId,
      stages: [],
      totalDurationMs: 0
    };
  }

  setMetadata(metadata: {
    lineageHash?: string;
    runtimeVersion?: string;
    inputFingerprint?: string;
    outputFingerprint?: string;
    failClosedTriggered?: boolean;
    restrictionFlags?: string[];
    payloadIntegrityStatus?: string;
    semanticCorruptionFlags?: string[];
    replayToken?: string;
  }) {
    Object.assign(this.trace, metadata);
  }

  startStage(stageName: string) {
    this.currentStageName = stageName;
    if (typeof performance !== 'undefined') {
      this.currentStageStart = performance.now();
    } else {
      this.currentStageStart = Date.now();
    }
  }

  endStage(status: 'SUCCESS' | 'FAILED' | 'SKIPPED', metadata?: Record<string, unknown>) {
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = end - this.currentStageStart;
    
    this.trace.stages.push({
      stageName: this.currentStageName,
      startedAt: new Date(Date.now() - duration).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Number(duration.toFixed(2)),
      status,
      metadata
    });
  }

  buildReplayEnvelope(): RuntimeReplayEnvelope | null {
    if (!this.trace.inputFingerprint || !this.trace.runtimeVersion || !this.trace.lineageHash) {
      return null;
    }
    
    const triggeredEngines = this.trace.stages.map(s => s.stageName);
    
    return {
      inputFingerprint: this.trace.inputFingerprint,
      runtimeVersion: this.trace.runtimeVersion,
      lineageHash: this.trace.lineageHash,
      traceId: this.trace.executionId,
      timestamp: new Date().toISOString(),
      executionPath: triggeredEngines,
      triggeredEngines,
      failClosedEvents: this.trace.failClosedTriggered ? ['FAIL_CLOSED_DETECTED'] : []
    };
  }

  async flushAndSave(): Promise<ExecutionTrace> {
    let total = 0;
    for (const stage of this.trace.stages) {
      total += stage.durationMs;
    }
    this.trace.totalDurationMs = Number(total.toFixed(2));
    this.trace.latencyMs = this.trace.totalDurationMs; // Align latency
    
    try {
      await ExecutionTraceBuilder.activeSink.recordExecutionTrace(this.trace);
    } catch (err) {
      console.error('[ExecutionTraceBuilder] Error saving trace:', err);
    }
    
    return this.trace;
  }

  static async getTrace(executionId: string): Promise<ExecutionTrace | null> {
    try {
      return await ExecutionTraceBuilder.activeSink.getTrace(executionId);
    } catch (err: unknown) {
      console.error('[ExecutionTraceBuilder] Error getting trace:', err);
      return null;
    }
  }
}
