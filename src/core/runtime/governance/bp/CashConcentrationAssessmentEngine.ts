import { BPSummary } from '../../../../lib/bpEngine';

export class CashConcentrationAssessmentEngine {
  static assess(summary: BPSummary) {
    if (!summary.ativoTotal || summary.ativoTotal <= 0) return null;
    if (summary.caixaEquivalentes === undefined || summary.caixaEquivalentes === null) return null;

    const cashRatio = summary.caixaEquivalentes / summary.ativoTotal;
    
    let classification = 'UNKNOWN';
    
    if (cashRatio <= 0.2) {
      classification = 'Baixa concentração';
    } else if (cashRatio <= 0.4) {
      classification = 'Concentração moderada';
    } else if (cashRatio <= 0.6) {
      classification = 'Reserva financeira elevada';
    } else {
      classification = 'Possível ociosidade de capital';
    }

    return {
      ratio: cashRatio,
      classification
    };
  }
}
