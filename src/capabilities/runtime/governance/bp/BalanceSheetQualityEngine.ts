import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { CashConcentrationAssessmentEngine } from './CashConcentrationAssessmentEngine';

export class BalanceSheetQualityEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static analyze(summary: BPSummary): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Qualidade do Ativo';

    if (summary.ativoTotal > 0) {
      const pctCaixa = summary.caixaEquivalentes / summary.ativoTotal;
      const pctClientes = summary.clientes / summary.ativoTotal;
      const pctEstoque = summary.estoques / summary.ativoTotal;
      const ativoPerm = summary.ativoPermanente || 0;
      const pctImob = ativoPerm / summary.ativoTotal;

      // Asset Concentration Risk
      let concentrationRisk = 'NEUTRAL';
      let rationale = 'Distribuição do ativo equilibrada.';

      if (pctEstoque > 0.5) {
        concentrationRisk = 'CRITICAL';
        rationale = `Risco de concentração elevado: ${(pctEstoque * 100).toFixed(1)}% do ativo está retido em estoques.`;
      } else if (pctClientes > 0.45) {
        concentrationRisk = 'ATTENTION';
        rationale = `Dependência excessiva da realização de recebíveis (${(pctClientes * 100).toFixed(1)}% do ativo).`;
      } else {
        const cashAssessment = CashConcentrationAssessmentEngine.assess(summary);
        if (cashAssessment) {
           rationale = cashAssessment.classification;
           if (rationale === 'Possível ociosidade de capital') concentrationRisk = 'CAPITAL_IDLE_WARNING';
           else if (rationale === 'Reserva financeira elevada') concentrationRisk = 'NEUTRAL'; // or ATTENTION
           else if (rationale === 'Baixa concentração') concentrationRisk = 'CRITICAL';
           else concentrationRisk = 'HEALTHY';
        }
      }

      indicators.push({
        metricName: 'Asset Concentration Risk',
        value: pctEstoque > 0.5 ? pctEstoque : (pctClientes > 0.45 ? pctClientes : pctCaixa),
        classification: concentrationRisk,
        severity: concentrationRisk,
        confidence: 95,
        evidence: { Caixa: pctCaixa, Clientes: pctClientes, Estoque: pctEstoque, Imobilizado: pctImob },
        rationale,
        lineageHash: `BSQE-${Date.now().toString(16)}`,
        family,
        format: 'percentage'
      });
    }

    return indicators;
  }
}
