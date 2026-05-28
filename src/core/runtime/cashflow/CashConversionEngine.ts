import { CashConversionMetrics } from './cashflow-types';

export class CashConversionEngine {
  public static calculate(
    cashFlowDoc: any,
    bpSummary: any,
    dreData: any
  ): CashConversionMetrics {
    if (!cashFlowDoc) {
      return {
        receivablesAging: 0,
        payablesAging: 0,
        cashConversionCycleDays: null,
        conversionEfficiency: 'FALTA_DADO',
        inventoryDrainImpact: null,
        isGrowthConsumingLiquidity: false,
        narrative: 'Dados de DFC não fornecidos para análise de conversão.'
      };
    }

    const receivablesAging = Number(cashFlowDoc.receivablesAging ?? cashFlowDoc.prazoRecebimento ?? 0);
    const payablesAging = Number(cashFlowDoc.payablesAging ?? cashFlowDoc.prazoPagamento ?? 0);
    
    // Check if we have inventory in Balance Sheet to analyze inventory drain
    let inventoryDrainImpact: number | null = null;
    let est = 0;
    let at = 1;
    if (bpSummary) {
      est = bpSummary.estoques || 0;
      at = bpSummary.ativoTotal || 1;
      if (at > 0) {
        inventoryDrainImpact = est / at;
      }
    }

    // Cash conversion cycle days (receivables days - payables days, adjust with inventory days if possible)
    let inventoryDays = 0;
    if (bpSummary && bpSummary.estoques && bpSummary.custoVendas) {
      const custo = Math.abs(bpSummary.custoVendas);
      if (custo > 0) {
        inventoryDays = Math.round((bpSummary.estoques / custo) * 360);
      }
    }
    const cashConversionCycleDays = receivablesAging + inventoryDays - payablesAging;

    // Conversion efficiency
    let conversionEfficiency: 'ALTA' | 'MODERADA' | 'LENTA' | 'PRESIONADA' | 'FALTA_DADO' = 'MODERADA';
    if (cashConversionCycleDays > 90) {
      conversionEfficiency = 'PRESIONADA';
    } else if (cashConversionCycleDays > 60) {
      conversionEfficiency = 'LENTA';
    } else if (cashConversionCycleDays > 30) {
      conversionEfficiency = 'MODERADA';
    } else {
      conversionEfficiency = 'ALTA';
    }

    // Is growth consuming liquidity?
    // Check if operatingCashFlow < 0 but company is growing (e.g. ebitda > 0 or hasDRE is true and receivablesAging is high)
    const operatingCashFlow = Number(cashFlowDoc.operatingCashFlow ?? 0);
    const isGrowingWithoutCash = operatingCashFlow < 0 && (receivablesAging > 45 || (inventoryDrainImpact && inventoryDrainImpact > 0.2));
    
    let narrative = '';
    if (conversionEfficiency === 'PRESIONADA') {
      narrative = 'O ciclo de conversão de caixa está severamente pressionado, indicando um prazo de recebimento excessivamente longo em relação aos pagamentos operacionais.';
    } else if (conversionEfficiency === 'LENTA') {
      narrative = 'O ciclo de conversão de caixa é lento. A velocidade de retorno dos recursos investidos no giro atrasa a recomposição do saldo de caixa.';
    } else {
      narrative = 'O ciclo de conversão de caixa é equilibrado, operando com prazos de recebimento e pagamento alinhados às necessidades de giro da operação.';
    }

    if (inventoryDrainImpact && inventoryDrainImpact > 0.25) {
      narrative += ` Há alta concentração de capital retido em estoques (${(inventoryDrainImpact * 100).toFixed(1)}% do Ativo Total), gerando um dreno silencioso de liquidez.`;
    }

    if (isGrowingWithoutCash) {
      narrative += ' O crescimento operacional ou a aceleração comercial estão consumindo ativamente a liquidez, com novas vendas gerando contas a receber sem a devida entrada de caixa.';
    }

    return {
      receivablesAging,
      payablesAging,
      cashConversionCycleDays,
      conversionEfficiency,
      inventoryDrainImpact,
      isGrowthConsumingLiquidity: isGrowingWithoutCash,
      narrative
    };
  }
}
