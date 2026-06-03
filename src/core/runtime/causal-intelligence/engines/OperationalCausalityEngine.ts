// src/core/runtime/causal-intelligence/engines/OperationalCausalityEngine.ts

import { CausalChain } from '../causal-types';
import { HistoricalRuntimeCycle } from '../../executive-timeline/executive-timeline-types';

export class OperationalCausalityEngine {
  public static detect(cycles: HistoricalRuntimeCycle[]): CausalChain[] {
    const chains: CausalChain[] = [];
    if (cycles.length < 2) return chains;

    const prev = cycles[cycles.length - 2];
    const curr = cycles[cycles.length - 1];

    // Symptom: EBITDA decline >= 15% or negative
    const ebitdaDeteriorated = curr.ebitda < prev.ebitda * 0.85 || curr.ebitda <= 0;
    
    if (ebitdaDeteriorated) {
      // Determine probable drivers
      let driver = 'PRESSÃO_DE_MARGEM_OPERACIONAL';
      let cause = 'INEFICIÊNCIA_DE_CUSTOS_FIXOS';
      let narrative = 'Margem operacional sob pressão devido a custos fixos operacionais elevados.';

      if (curr.netIncome < prev.netIncome * 0.85) {
        driver = 'COMPRESSÃO_DE_MARGEM_LÍQUIDA';
        cause = 'AUMENTO_DE_DESPESAS_ADMINISTRATIVAS';
        narrative = 'Erosão operacional provocada pelo crescimento de despesas operacionais administrativas.';
      }

      chains.push({
        cause,
        driver,
        effect: 'EROSÃO_DE_EBITDA',
        narrative,
        category: 'OPERATIONAL',
        severity: curr.ebitda <= 0 ? 'CRITICAL' : 'WARNING',
        lineageHash: `cause_op_${curr.cycleReference}_${curr.lineageHash}`
      });
    }

    return chains;
  }
}
