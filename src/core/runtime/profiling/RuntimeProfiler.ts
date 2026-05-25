import { StageLatency, RuntimeStage, RuntimeLatencySnapshot } from './ProfilingTypes';

/**
 * Profiler Passivo para medir tempo de execução sem afetar Event Loop
 */
export class RuntimeProfiler {
  private static timers = new Map<string, number>();
  private static snapshots = new Map<string, RuntimeLatencySnapshot>();

  static startStage(executionId: string, stage: RuntimeStage) {
    this.timers.set(`${executionId}_${stage}`, performance.now());
  }

  static endStage(executionId: string, stage: RuntimeStage): number {
    const key = `${executionId}_${stage}`;
    const start = this.timers.get(key);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.timers.delete(key);
    
    this.recordLatency(executionId, stage, duration);
    return duration;
  }

  private static recordLatency(executionId: string, stage: RuntimeStage, durationMs: number) {
    if (!this.snapshots.has(executionId)) {
      this.snapshots.set(executionId, {
        executionId,
        tenantId: 'UNKNOWN', // Atualizado externamente se necessário
        workspaceId: 'UNKNOWN',
        totalDurationMs: 0,
        stages: [],
        bottlenecks: []
      });
    }

    const snapshot = this.snapshots.get(executionId)!;
    snapshot.stages.push({
      stage,
      durationMs,
      timestamp: new Date().toISOString()
    });
    snapshot.totalDurationMs += durationMs;
  }

  static getSnapshot(executionId: string): RuntimeLatencySnapshot | null {
    return this.snapshots.get(executionId) || null;
  }

  static clear(executionId: string) {
    this.snapshots.delete(executionId);
  }
}
