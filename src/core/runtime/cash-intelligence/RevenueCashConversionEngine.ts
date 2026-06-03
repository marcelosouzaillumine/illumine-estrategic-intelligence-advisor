import { RevenueCashConversion, CashConfidenceLevel } from './CashIntelligenceTypes';

export class RevenueCashConversionEngine {
  public static evaluate(
    fcoOperacionalReal: number,
    receitaLiquida: number,
    confidenceLevel: CashConfidenceLevel
  ): RevenueCashConversion {
    if (receitaLiquida <= 0) {
      return {
        cashConversionPer100Revenue: 0,
        classification: 'DESTRUI_CAIXA',
        rationale: 'Não há receita líquida reportada para cálculo de conversão.',
        confidenceLevel: 'BLOCKED',
        sourceMetrics: { fcoOperacionalReal, receitaLiquida }
      };
    }

    const ratio = fcoOperacionalReal / receitaLiquida;
    const cashConversionPer100Revenue = Math.round(ratio * 100);

    let classification: RevenueCashConversion['classification'] = 'EQUILIBRADO';
    let rationale = '';

    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Math.abs(cashConversionPer100Revenue));

    if (cashConversionPer100Revenue > 15) {
      classification = 'GERA_CAIXA';
      rationale = `Para cada R$100 vendidos, ${formattedValue} foram gerados pela operação.`;
    } else if (cashConversionPer100Revenue > 0) {
      classification = 'GERA_CAIXA';
      rationale = `Para cada R$100 vendidos, ${formattedValue} foram gerados pela operação.`;
    } else if (cashConversionPer100Revenue === 0) {
      classification = 'EQUILIBRADO';
      rationale = `A conversão da receita em caixa está em equilíbrio (R$ 0).`;
    } else if (cashConversionPer100Revenue > -20) {
      classification = 'CONSOME_CAIXA';
      rationale = `Para cada R$100 vendidos, ${formattedValue} foram consumidos pela operação.`;
    } else {
      classification = 'DESTRUI_CAIXA';
      rationale = `Para cada R$100 vendidos, ${formattedValue} foram consumidos pela operação.`;
    }

    return {
      cashConversionPer100Revenue,
      classification,
      rationale,
      confidenceLevel,
      sourceMetrics: {
        fcoOperacionalReal,
        receitaLiquida
      }
    };
  }
}
