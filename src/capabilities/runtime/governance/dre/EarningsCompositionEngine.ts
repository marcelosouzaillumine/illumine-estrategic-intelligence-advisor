export type EarningsQualityClassification = 'HIGH_QUALITY_EARNINGS' | 'MEDIUM_QUALITY_EARNINGS' | 'LOW_QUALITY_EARNINGS' | 'UNDETERMINED_EARNINGS_QUALITY';

export interface EarningsQualityAssessment {
  classification: EarningsQualityClassification;
  recurringRevenueWeight: number;
  nonRecurringWeight: number;
  rationale: string;
}

export class EarningsCompositionEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    receitaLiquida: number,
    outrasReceitasDespesas: number,
    resultadoFinanceiro: number,
    lucroLiquido: number,
    lucroBruto: number,
    isChartOfAccountsSimplified: boolean
  ): EarningsQualityAssessment {
    if (isChartOfAccountsSimplified || receitaLiquida === 0) {
      return {
        classification: 'UNDETERMINED_EARNINGS_QUALITY',
        recurringRevenueWeight: 0,
        nonRecurringWeight: 0,
        rationale: 'Evidências insuficientes: o plano de contas atual não permite desagregação confiável para atestar a qualidade orgânica do resultado.'
      };
    }

    const operacaoBase = lucroBruto; // Simplified proxy for core operations contribution before OPEX
    const efeitoNaoOperacional = outrasReceitasDespesas + resultadoFinanceiro; // Can be positive or negative
    
    // For weighting, we compare absolute contribution
    const totalEffect = Math.abs(operacaoBase) + Math.abs(efeitoNaoOperacional);
    const recurringRevenueWeight = totalEffect > 0 ? Math.abs(operacaoBase) / totalEffect : 0;
    const nonRecurringWeight = totalEffect > 0 ? Math.abs(efeitoNaoOperacional) / totalEffect : 0;

    let classification: EarningsQualityClassification = 'MEDIUM_QUALITY_EARNINGS';
    let rationale = '';

    // Profit largely driven by non-recurring or financial events
    if (lucroLiquido > 0 && efeitoNaoOperacional > 0 && (efeitoNaoOperacional > lucroLiquido * 0.5)) {
      classification = 'LOW_QUALITY_EARNINGS';
      rationale = 'O resultado final encontra-se artificialmente sustentado por eventos extraordinários ou receitas financeiras, mascarando fragilidades no núcleo operacional.';
    } 
    // Profit driven by core operations
    else if (lucroLiquido > 0 && recurringRevenueWeight >= 0.8) {
      classification = 'HIGH_QUALITY_EARNINGS';
      rationale = 'A geração de resultado advém majoritariamente da atividade-fim da empresa, atestando alta previsibilidade e solidez estrutural.';
    }
    // High quality loss (purely operational loss, no masking)
    else if (lucroLiquido < 0 && recurringRevenueWeight >= 0.8) {
      classification = 'HIGH_QUALITY_EARNINGS';
      rationale = 'Apesar do prejuízo contábil, não há distorções significativas por itens extraordinários. O déficit é legitimamente reflexo da dinâmica operacional base.';
    }
    else {
      classification = 'MEDIUM_QUALITY_EARNINGS';
      rationale = 'Há presença moderada de eventos não recorrentes ou pressões financeiras compondo o resultado final.';
    }

    return {
      classification,
      recurringRevenueWeight: recurringRevenueWeight * 100,
      nonRecurringWeight: nonRecurringWeight * 100,
      rationale
    };
  }
}
