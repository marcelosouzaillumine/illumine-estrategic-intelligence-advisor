/**
 * Avalia o Estado Financeiro baseando-se em uma matriz de indicadores cruzados
 * (Ex: Liquidez vs Patrimônio Líquido vs Capital de Giro) em vez de uma régua linear.
 */
export class BusinessFinancialStateClassifier {
  
  /**
   * Determina o status da empresa.
   * @param financialData Payload financeiro já sanitizado pela camada de integridade
   */
  public static classify(financialData: any): string {
    const equity = financialData.equity ?? 0;
    const currentAssets = financialData.currentAssets ?? 0;
    const currentLiabilities = financialData.currentLiabilities ?? 0;
    
    let liquidity = 1;
    if (currentLiabilities > 0) {
      liquidity = currentAssets / currentLiabilities;
    }
    const workingCapital = currentAssets - currentLiabilities;

    // Matriz de Decisão
    if (equity < 0) {
      if (liquidity < 1 || workingCapital < 0) {
        return 'RISCO DE CONTINUIDADE';
      }
      return 'REESTRUTURAÇÃO PATRIMONIAL';
    } else {
      if (liquidity < 1) {
        return 'RECUPERAÇÃO PATRIMONIAL'; // PL Positivo, mas ciclo destruído
      }
      if (liquidity > 1 && liquidity < 1.5) {
        return 'PRESSÃO FINANCEIRA CONTROLADA'; // Saudável, mas com margem de segurança baixa
      }
      return 'CRESCIMENTO SUSTENTÁVEL'; // PL Positivo, Liquidez > 1.5
    }
  }

  /**
   * Retorna os motivos técnicos que basearam a classificação.
   */
  public static getClassificationReasons(financialData: any): string[] {
    const reasons = [];
    if (financialData.equity < 0) reasons.push('Patrimônio líquido negativo (Passivo a Descoberto)');
    else reasons.push('Patrimônio líquido positivo');

    if (financialData.currentLiabilities > 0) {
      const liq = (financialData.currentAssets / financialData.currentLiabilities).toFixed(2);
      reasons.push(`Liquidez corrente de ${liq}`);
    }

    const wc = (financialData.currentAssets ?? 0) - (financialData.currentLiabilities ?? 0);
    if (wc < 0) reasons.push('Capital de giro líquido negativo');
    
    return reasons;
  }
}
