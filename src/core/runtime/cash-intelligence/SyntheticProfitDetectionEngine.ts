import { InstitutionalCashSignal } from './types';

export class SyntheticProfitDetectionEngine {
  public static evaluate(
    netIncome: number,
    fco: number,
    workingCapitalDrain: number,
    receivables: number,
    inventory: number
  ): InstitutionalCashSignal {
    let classification = 'HEALTHY' as any;
    let narrative = 'Crescimento e lucro suportados por conversão orgânica sem retenção sintética de giro.';

    // This checks for profit without cash, mostly absorbed by receivables or inventory.
    if (netIncome > 0 && fco < 0) {
      if (workingCapitalDrain > 0) {
        classification = 'CRITICAL';
        narrative = 'Lucro sintético: Margem contábil positiva inteiramente asfixiada pela necessidade de retenção em giro, não gerando liquidez livre.';
      } else {
        classification = 'DETERIORATING';
        narrative = 'Incoerência de liquidez: Lucro não se traduz em caixa, evidenciando assimetria entre competência e recebimento.';
      }
    } else if (netIncome > 0 && fco > 0 && fco < netIncome * 0.3) {
      classification = 'ATTENTION';
      narrative = 'Baixa propensão à conversão de caixa. Margem existe, mas o ciclo absorve a maior parte da liquidez gerada.';
    }

    return {
      id: 'syntheticProfitRisk',
      label: 'Risco de Lucro Sintético',
      classification,
      confidence: 'HIGH',
      narrative,
      lineage: ['DRE.LucroLiquido', 'DFC.FCO', 'DFC.VariacaoCapitalGiro'],
      disclosures: []
    };
  }
}
