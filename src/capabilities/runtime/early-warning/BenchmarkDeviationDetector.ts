import { RiskSignal } from './EarlyWarningTypes';

export class BenchmarkDeviationDetector {
  static detectDeviations(tenantId: string): RiskSignal[] {
    // MOCK: Deterioração da liquidez descolando do setor
    return [
      {
        source: 'BENCHMARK_ENGINE',
        value: 0.6,
        metadata: {
          insight: 'Asfixia de liquidez do Tenant é 40% superior à mediana do Cohort (K-Anonymity preservado).'
        }
      }
    ];
  }
}
