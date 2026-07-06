import { DFCDivergenceSeverity } from './CashFlowGovernanceOutput';

export class DFCCashBPDivergenceAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    accountingProfit: number,
    fco: number,
    cashEndBP: number,
    cashEndDFC: number
  ): { severity: DFCDivergenceSeverity; explanation: string | null } {
    
    // 1. Check strict mathematical equivalence between BP Cash and DFC Cash Final
    const cashDifference = Math.abs(cashEndBP - cashEndDFC);
    
    // Materiality threshold: 1% of BP Cash, capped at R$ 1000
    const materialityLimit = Math.min(1000, cashEndBP * 0.01);
    
    if (cashDifference > 100 && cashDifference <= materialityLimit) {
      return {
        severity: 'EXPLAINABLE_WARNING',
        explanation: `Atenção: Diferença imaterial (R$ ${cashDifference.toFixed(2)}) entre o caixa final calculado pela DFC e a linha de Disponibilidades do Balanço Patrimonial (R$ ${cashEndBP.toFixed(2)}). Toleradp dentro do limite dinâmico de materialidade.`
      };
    } else if (cashDifference > materialityLimit) {
      return {
        severity: 'MATHEMATICAL_BLOCKING',
        explanation: `Divergência matemática acima da materialidade: O saldo final de caixa da DFC (R$ ${cashEndDFC.toFixed(2)}) difere em R$ ${cashDifference.toFixed(2)} das Disponibilidades do BP (R$ ${cashEndBP.toFixed(2)}). Limite tolerado: R$ ${materialityLimit.toFixed(2)}.`
      };
    }

    // 2. Conceptual divergence (Explainable Warning)
    // Positive Profit but Negative Operating Cash Flow
    if (accountingProfit > 0 && fco < 0) {
      return {
        severity: 'EXPLAINABLE_WARNING',
        explanation: `Atenção Executiva: A operação reporta lucro contábil (R$ ${accountingProfit.toFixed(2)}), mas consome caixa operacional (R$ ${fco.toFixed(2)}). Este crescimento contábil está sendo financiado por queima de caixa, sugerindo que os recursos estão retidos no capital de giro (contas a receber ou estoques).`
      };
    }

    // High Negative Profit but Positive Cash (Depreciation / Liquidation of assets)
    if (accountingProfit < 0 && fco > 0 && Math.abs(accountingProfit) > fco) {
       return {
        severity: 'EXPLAINABLE_WARNING',
        explanation: `Atenção Executiva: A operação reporta prejuízo contábil (R$ ${accountingProfit.toFixed(2)}), mas gerou caixa operacional (R$ ${fco.toFixed(2)}). Contexto indisponível.`
      };
    }

    return { severity: 'NONE', explanation: null };
  }
}
