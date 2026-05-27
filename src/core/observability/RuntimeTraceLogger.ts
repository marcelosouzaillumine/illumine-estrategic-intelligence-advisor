export interface RuntimeTrace {
  traceId: string;
  timestamp: string;
  tenantId: string;
  executionTimeMs: number;
  runtimeMode: string;
  lineageHash: string;
  hasWarnings: boolean;
  warnings: string[];
}

export class RuntimeTraceLogger {
  private static traces: RuntimeTrace[] = [];

  public static logTrace(trace: Omit<RuntimeTrace, 'traceId' | 'timestamp'>): RuntimeTrace {
    const fullTrace: RuntimeTrace = {
      ...trace,
      traceId: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.traces.push(fullTrace);

    // Keep size bounded in memory
    if (this.traces.length > 500) {
      this.traces.shift();
    }

    console.log(`[RuntimeTraceLogger] ${fullTrace.runtimeMode} trace logged for tenant ${fullTrace.tenantId} in ${fullTrace.executionTimeMs}ms.`);
    return fullTrace;
  }

  public static getTracesForTenant(tenantId: string): RuntimeTrace[] {
    return this.traces.filter(t => t.tenantId === tenantId);
  }

  public static getRecentTraces(): RuntimeTrace[] {
    return this.traces;
  }
}
