import { CashIntelligenceThresholds } from './CashIntelligenceThresholds';
import { InstitutionalCashSignal, CashQualityClassification } from './types';

export class EarningsQualityEngine {
  /**
   * Avalia a qualidade do lucro líquido e EBITDA com base na efetiva conversão em caixa operacional (FCO).
   */
  public static evaluate(
    netIncome: number,
    ebitda: number,
    fco: number,
    hasRecurringNegativeFco: boolean = false
  ): InstitutionalCashSignal {
    const { FCO } = CashIntelligenceThresholds;
    let classification: CashQualityClassification = 'HEALTHY';
    let narrative = 'Conversão de caixa íntegra.';
    
    if (fco < 0) {
      if (netIncome > 0) {
        classification = FCO.POSITIVE_NET_INCOME_NEGATIVE_FCO_MIN_SEVERITY;
        narrative = 'Lucro contábil positivo, porém a operação consome liquidez. Qualidade do lucro deteriorada.';
      } else if (ebitda > 0) {
        if (hasRecurringNegativeFco) {
          classification = FCO.POSITIVE_EBITDA_NEGATIVE_FCO_RECURRING;
          narrative = 'Geração operacional (EBITDA) positiva com consumo recorrente de caixa. Risco estrutural crítico na conversão.';
        } else {
          classification = FCO.POSITIVE_EBITDA_NEGATIVE_FCO_ISOLATED;
          narrative = 'EBITDA positivo, mas o ciclo absorveu caixa. Requer atenção à dinâmica de giro no exercício.';
        }
      } else {
        classification = FCO.DEFAULT_NEGATIVE_FCO;
        narrative = 'Operação sistematicamente deficitária. Margens e caixa em compressão.';
      }
    } else {
      // FCO > 0
      if (fco > netIncome && netIncome > 0) {
        classification = 'HEALTHY';
        narrative = 'Alta qualidade de lucro, com conversão de caixa (FCO) superando o lucro líquido contabilizado.';
      } else if (fco < netIncome * 0.5 && netIncome > 0) {
        classification = 'ATTENTION';
        narrative = 'Lucro líquido forte, porém baixa eficiência de conversão em caixa operacional (FCO inferior a 50% do lucro).';
      }
    }

    return {
      id: 'earningsCashConversion',
      label: 'Qualidade do Lucro (Earnings Quality)',
      classification,
      confidence: 'HIGH',
      value: fco,
      displayValue: fco.toString(),
      narrative,
      lineage: ['DRE.LucroLiquido', 'DRE.EBITDA', 'DFC.FCO'],
      disclosures: []
    };
  }
}
