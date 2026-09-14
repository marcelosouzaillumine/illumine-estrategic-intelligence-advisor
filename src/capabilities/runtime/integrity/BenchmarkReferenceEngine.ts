import { BenchmarkGovernanceRegistry, SectorBenchmark } from './BenchmarkGovernanceRegistry';

export class BenchmarkReferenceEngine {
  public static resolve(
    metricKey: string,
    segment: string,
    economicModel?: string,
    boardConfig?: any
  ): { target: number; origin: string; label: string; confidence: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'UNAVAILABLE' } {
    const benchmark = BenchmarkGovernanceRegistry.getBenchmark(segment, boardConfig);

    // 1. Board Custom KPI
    if (boardConfig?.customBenchmarks && boardConfig.customBenchmarks[metricKey] !== undefined) {
      return {
        target: boardConfig.customBenchmarks[metricKey],
        origin: 'BOARD_CUSTOM',
        label: 'Referência definida pelo Board',
        confidence: 'HIGH_CONFIDENCE'
      };
    }

    // 2. Sector Specific
    if (benchmark && benchmark.sourceType === 'SECTOR_SPECIFIC') {
      const target = this.getMetricTarget(metricKey, benchmark);
      return {
        target,
        origin: 'SECTOR_SPECIFIC',
        label: `Benchmark: ${benchmark.benchmarkOrigin}`,
        confidence: 'MEDIUM_CONFIDENCE'
      };
    }

    // 3. Generic Economic Model Benchmark
    if (benchmark && benchmark.sourceType === 'GENERIC_MODEL') {
      const target = this.getMetricTarget(metricKey, benchmark);
      const modelName = economicModel || benchmark.economicModel;
      return {
        target,
        origin: 'GENERIC_MODEL',
        label: `Benchmark: ${benchmark.benchmarkOrigin} (Referencial aproximado para ${modelName}, não aplicável como meta técnica definitiva)`,
        confidence: 'LOW_CONFIDENCE'
      };
    }

    // 4. Undefined / None
    return {
      target: 0,
      origin: 'NONE',
      label: 'Referência estratégica não definida.',
      confidence: 'UNAVAILABLE'
    };
  }

  private static getMetricTarget(key: string, bench: SectorBenchmark): number {
    switch (key) {
      case 'cmvVal': return bench.targetCmvMax;
      case 'ebitdaVal': return bench.targetEbitdaMin;
      case 'despAdmin': return bench.targetAdminMax;
      case 'despFin': return bench.targetFinMax;
      case 'burdenTributario': return bench.targetTribMax;
      case 'capacidadeAbsorcao': return bench.targetAbsorcaoMin;
      default: return 0;
    }
  }
}
