import { RuntimeLatencySnapshot } from './ProfilingTypes';

const LATENCY_THRESHOLDS = {
  DATA_FETCH: 2000,
  VALIDATION: 500,
  CONSOLIDATION: 1000,
  ADVISORY: 1500,
  SCENARIO_PROPAGATION: 3000,
  REPORT_GENERATION: 2000,
  REPLAY_LOADING: 1000,
  CACHE_SERIALIZATION: 500
};

export class ExecutionLatencyAnalyzer {
  /**
   * Avalia um snapshot de latência em busca de gargalos sem alterar fluxo.
   */
  static analyze(snapshot: RuntimeLatencySnapshot): RuntimeLatencySnapshot {
    const bottlenecks: string[] = [];

    snapshot.stages.forEach(stage => {
      const threshold = LATENCY_THRESHOLDS[stage.stage] || 1000;
      if (stage.durationMs > threshold) {
        bottlenecks.push(`[GARGALO] Estágio ${stage.stage} excedeu o limite seguro: ${stage.durationMs.toFixed(2)}ms (Threshold: ${threshold}ms)`);
      }
    });

    snapshot.bottlenecks = bottlenecks;
    
    if (bottlenecks.length > 0) {
      console.warn(`[ExecutionLatencyAnalyzer] Gargalos detectados na execução ${snapshot.executionId}:`, bottlenecks);
    }

    return snapshot;
  }
}
