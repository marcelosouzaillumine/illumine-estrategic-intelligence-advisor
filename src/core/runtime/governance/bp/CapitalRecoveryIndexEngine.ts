import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export class CapitalRecoveryIndexEngine {
  public static evaluate(summary: BPSummary): PatrimonialIndicator | null {
    if (summary.capitalSocial === 0 || summary.patrimonioLiquido >= summary.capitalSocial) {
      return null;
    }

    const cri = (summary.capitalSocial - summary.patrimonioLiquido) / summary.capitalSocial;
    
    return {
      metricName: 'Capital Recovery Index',
      value: cri,
      classification: cri > 0.5 ? 'CRITICAL' : 'ATTENTION',
      severity: cri > 0.5 ? 'CRITICAL' : 'ATTENTION',
      confidence: 100,
      evidence: { capitalSocial: summary.capitalSocial, patrimonioLiquido: summary.patrimonioLiquido },
      rationale: `A companhia necessita recompor aproximadamente ${(cri * 100).toFixed(1)}% do capital originalmente aportado para restaurar integralmente sua posição patrimonial.`,
      lineageHash: `CRI-IDX-${Date.now().toString(16)}`,
      family: 'Turnaround Intelligence',
      format: 'percentage'
    };
  }
}
