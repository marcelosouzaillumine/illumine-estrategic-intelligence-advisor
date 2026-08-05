export interface ObservabilityLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  layer: 'Repository' | 'Provider' | 'Pipeline' | 'Query' | 'Snapshot' | 'Engine' | 'Validation' | 'Cache' | 'Firestore' | 'SQL';
  action: string;
  
  // Tracing
  correlationId?: string;
  requestId?: string;
  pipelineId?: string;
  snapshotId?: string;
  
  // Metrics
  latencyMs?: number;
  cacheHit?: boolean;
  cacheMiss?: boolean;
  
  // Error tracking
  error?: any;
  metadata?: Record<string, any>;
}

export class DataObservabilityService {
  static log(entry: ObservabilityLog) {
    // In a real implementation, this connects to Datadog / Application Insights / ELK
    console.log(`[Observability][${entry.layer}] ${entry.action} - ${entry.latencyMs ? entry.latencyMs + 'ms' : ''}`, entry);
  }

  static trackLatency<T>(layer: ObservabilityLog['layer'], action: string, operation: () => Promise<T>): Promise<T> {
    const start = Date.now();
    return operation()
      .then(result => {
        const latencyMs = Date.now() - start;
        this.log({
          timestamp: new Date().toISOString(),
          level: 'info',
          layer,
          action,
          latencyMs
        });
        return result;
      })
      .catch(error => {
        const latencyMs = Date.now() - start;
        this.log({
          timestamp: new Date().toISOString(),
          level: 'error',
          layer,
          action,
          latencyMs,
          error
        });
        throw error;
      });
  }
}
