// src/core/runtime/causal-intelligence/engines/TreasuryCausalityEngine.ts

import { CausalChain } from '../causal-types';
import { HistoricalRuntimeCycle } from '../../../../../core/runtime/executive-timeline';

export class TreasuryCausalityEngine {
  public static detect(cycles: HistoricalRuntimeCycle[]): CausalChain[] {
    const chains: CausalChain[] = [];
    if (cycles.length < 2) return chains;

    const prev = cycles[cycles.length - 2];
    const curr = cycles[cycles.length - 1];

    // Symptom: Cash Equivalents decline >= 15% OR Negative OCF
    const cashDepleted = curr.cashEquivalents < prev.cashEquivalents * 0.85 || curr.ocf < 0;

    if (cashDepleted) {
      const cause = curr.ocf < 0 ? 'INSUFICIÊNCIA_OPERACIONAL_DE_CAIXA' : 'CAPEX_EXCESSIVO_DE_INVESTIMENTO';
      const driver = 'QUEIMA_DE_CAIXA_OPERACIONAL';
      const effect = 'RETRAÇÃO_DE_RESERVAS_DE_LIQUIDEZ';
      const narrative = 'Insuficiência na geração de caixa operacional comprometendo a sustentabilidade de tesouraria.';

      chains.push({
        cause,
        driver,
        effect,
        narrative,
        category: 'TREASURY',
        severity: curr.cashEquivalents < curr.totalDebt * 0.1 ? 'CRITICAL' : 'WARNING',
        lineageHash: `cause_treas_${curr.cycleReference}_${curr.lineageHash}`
      });
    }

    return chains;
  }
}
