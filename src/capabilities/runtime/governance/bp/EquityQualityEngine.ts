import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { NaNEliminationGuard } from '../common/NaNEliminationGuard';
import { sanitize } from '../../../../workspace/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard';

export class EquityQualityEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Evaluates the quality of the Equity (Patrimônio Líquido)
   */
  static evaluate(summary: BPSummary): {
    indicators: PatrimonialIndicator[];
    equityQualityClass: string;
    consumptionRatio: number | null;
    capitalConsumedAmount: number | null;
  } {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Qualidade Patrimonial';

    if (summary.patrimonioLiquido === 0 && summary.capitalSocial === 0) {
      return { indicators: [], equityQualityClass: 'INSUFFICIENT_DATA', consumptionRatio: null, capitalConsumedAmount: null };
    }

    const lucrosPrejuizos = summary.lucrosPrejuizos || 0;
    const capital = summary.capitalSocial || 0;
    
    let eqClass = 'Baixa';
    let severity = 'ATTENTION';
    let rationale = 'PL sustentado predominantemente por aporte dos sócios.';
    let consumptionRatio: number | null = null;
    let capitalConsumedAmount: number | null = null;
    let metricValue: number | string = 'INSUFFICIENT_DATA';
    let format: 'string' | 'percentage' = 'string';

    // Se lucrosPrejuizos for menor que zero, significa que há perdas (prejuízos acumulados)
    if (lucrosPrejuizos < 0) {
      capitalConsumedAmount = Math.abs(lucrosPrejuizos);
      if (capital > 0) {
        consumptionRatio = Number(NaNEliminationGuard.sanitizeNumber(capitalConsumedAmount / capital, 0));
        if (consumptionRatio > 0.75) {
          eqClass = 'Crítico';
          severity = 'CRITICAL';
          rationale = 'O patrimônio apresenta erosão severa do capital originalmente aportado. A preservação da continuidade operacional depende da recuperação da rentabilidade e recomposição progressiva do patrimônio líquido.';
          metricValue = consumptionRatio;
          format = 'percentage';
        } else if (consumptionRatio > 0.40) {
          eqClass = 'Crítico';
          severity = 'CRITICAL';
          rationale = `Parcela relevante do capital originalmente aportado pelos sócios foi consumida por prejuízos acumulados. A recomposição patrimonial dependerá da geração consistente de resultados operacionais futuros.`;
          metricValue = consumptionRatio;
          format = 'percentage';
        } else {
          eqClass = 'Atenção';
          rationale = 'PL apresenta princípio de erosão por prejuízos acumulados incipientes.';
          metricValue = 'Baixa';
        }
      } else {
        // PL negativo ou sem capital documentado
        eqClass = 'Crítico';
        severity = 'CRITICAL';
        rationale = 'Patrimônio consumido por resultados negativos recorrentes.';
        metricValue = 'Consumo de Capital';
      }
    } else {
      // lucrosPrejuizos >= 0 significa que há lucros retidos ou zero perdas
      if (summary.patrimonioLiquido > capital * 1.2) {
        eqClass = 'Saudável';
        severity = 'HEALTHY';
        rationale = 'PL suportado primariamente pela retenção de lucros operacionais (elevada qualidade).';
        metricValue = 'Alta';
      } else {
        eqClass = 'Atenção';
        severity = 'ATTENTION';
        rationale = 'PL possui sustentação mista entre lucros gerados e capitalização externa.';
        metricValue = 'Moderada';
      }
    }

    indicators.push({
      metricName: 'Equity Quality Index',
      value: metricValue,
      classification: sanitize(eqClass),
      severity: severity,
      confidence: 100,
      evidence: { lucrosPrejuizos, capital, consumptionRatio, capitalConsumedAmount },
      rationale: sanitize(rationale),
      lineageHash: `EQE-IDX-${Date.now().toString(16)}`,
      family,
      format
    });

    return {
      indicators,
      equityQualityClass: sanitize(eqClass),
      consumptionRatio,
      capitalConsumedAmount
    };
  }
}
