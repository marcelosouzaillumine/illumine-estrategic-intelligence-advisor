// src/core/runtime/causal-intelligence/engines/WorkingCapitalCausalityEngine.ts

import { CausalChain } from '../causal-types';
import { HistoricalRuntimeCycle } from '../../../../../workspace/runtime/executive-timeline/executive-timeline-types';

export class WorkingCapitalCausalityEngine {
  public static detect(cycles: HistoricalRuntimeCycle[]): CausalChain[] {
    const chains: CausalChain[] = [];
    if (cycles.length < 2) return chains;

    const prev = cycles[cycles.length - 2];
    const curr = cycles[cycles.length - 1];

    // Symptom: Working Capital decline or inversion
    const workingCapitalPressure = curr.workingCapital < prev.workingCapital || curr.workingCapital < 0;

    if (workingCapitalPressure) {
      const cause = 'DILATAÇÃO_DE_ciclos_DE_RECEBIMENTO';
      const driver = 'PRESSÃO_DE_CAPITAL_DE_GIRO';
      const effect = 'CONSUMO_DE_FLUXO_DE_CAIXA';
      const narrative = 'Dilatação no ciclo operacional pressionou a necessidade de capital de giro, reduzindo a liquidez.';

      chains.push({
        cause,
        driver,
        effect,
        narrative,
        category: 'WORKING_CAPITAL',
        severity: curr.workingCapital < 0 ? 'CRITICAL' : 'WARNING',
        lineageHash: `cause_wc_${curr.cycleReference}_${curr.lineageHash}`
      });
    }

    return chains;
  }
}
