export class DFCCausalChainEngine {
  static evaluate(
    accountingProfit: number,
    fco: number,
    shareholderContributions: number,
    finalCash: number
  ): { hasBreak: boolean; breakReason: string | null; causalNarrative: string } {
    
    // Base causal logic
    let narrative = '';

    // Scenario: Lucro positivo, FCO negativo, Aporte positivo, Caixa final positivo
    if (accountingProfit > 0 && fco < 0 && shareholderContributions > 0 && finalCash > 0) {
      narrative = 'O caixa final permaneceu positivo, porém sustentado por aporte dos sócios após consumo operacional de caixa decorrente do aumento de capital de giro (lucro não convertido em liquidez).';
    } 
    else if (accountingProfit < 0 && fco > 0) {
      narrative = 'A operação reportou prejuízo contábil, mas gerou caixa operacional, indicando possível liquidação de ativos circulantes (estoques/recebíveis) ou efeitos não-caixa severos na DRE.';
    }
    else if (fco > 0 && shareholderContributions === 0) {
      narrative = 'O caixa final é resultado direto da geração operacional sustentável, sem necessidade de interferência externa ou societária.';
    }
    else if (fco < 0 && shareholderContributions === 0 && finalCash > 0) {
      narrative = 'A operação consumiu caixa operacional e se manteve com saldo positivo apenas consumindo reservas anteriores (queima de caixa disponível), sem novos aportes.';
    }
    else if (fco < 0 && finalCash < 0) {
      narrative = 'A operação está em ruptura de liquidez, consumindo caixa operacional sem cobertura suficiente de capital.';
      return { hasBreak: true, breakReason: 'DFC_CAUSAL_CHAIN_BREAK: Ruptura de liquidez severa.', causalNarrative: narrative };
    }
    else {
      narrative = 'A cadeia causal indica compatibilidade normal entre lucro, geração de caixa e saldo final.';
    }

    return { hasBreak: false, breakReason: null, causalNarrative: narrative };
  }
}
