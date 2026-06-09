import { BPSummary } from '../../../../lib/bpEngine';
import { NaNEliminationGuard } from '../common/NaNEliminationGuard';

export class DebtToEquityEngine {
  static calculate(summary: BPSummary) {
    const passivoTotal = NaNEliminationGuard.sanitizeNumber(summary.passivoTotal || 0);
    const patrimonioLiquido = NaNEliminationGuard.sanitizeNumber(summary.patrimonioLiquido);

    if (passivoTotal === 'INSUFFICIENT_DATA' || patrimonioLiquido === 'INSUFFICIENT_DATA' || patrimonioLiquido === 0) {
      return {
        value: 'N/A',
        classification: 'UNKNOWN',
        score: 0,
        explanation: 'Dados insuficientes para cálculo ou Patrimônio Líquido nulo/inexistente.'
      };
    }

    // In cases like Granatum 2023, if passivoTotal is 0, the ratio is 0 or 'N/A' depending on business rules.
    // The user requested Debt-to-Equity to be 'N/A' if there is no onerous debt for Granatum.
    if (passivoTotal === 0) {
      return {
        value: 'N/A',
        classification: 'HEALTHY',
        score: 100,
        explanation: 'A empresa não possui dívida onerosa (empréstimos/financiamentos) reportada no balanço.'
      };
    }

    const ratio = (passivoTotal as number) / (patrimonioLiquido as number);
    
    let classification = 'HEALTHY';
    let score = 100;
    
    if (ratio > 2.0) {
      classification = 'CRITICAL';
      score = 20;
    } else if (ratio > 1.0) {
      classification = 'WARNING';
      score = 60;
    }

    return {
      value: ratio.toFixed(2) + 'x',
      classification,
      score,
      explanation: `A Dívida Onerosa representa ${(ratio * 100).toFixed(1)}% do Patrimônio Líquido.`
    };
  }
}
