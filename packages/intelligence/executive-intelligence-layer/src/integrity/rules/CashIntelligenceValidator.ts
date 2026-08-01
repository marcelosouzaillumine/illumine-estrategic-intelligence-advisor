import { CashConversionStatus } from '../../contracts/FinancialIntelligenceAssessment';

export class CashIntelligenceValidator {
  /**
   * Cash Conversion Intelligence™
   * Classifica a conversão de EBITDA em Caixa Operacional
   */
  public static validate(financialData: any): { status: CashConversionStatus, conversionRate: number, alert?: string } {
    const ebitda = financialData.ebitda || 0;
    const operatingCashFlow = financialData.operatingCashFlow || 0;
    const currentAssets = financialData.currentAssets || 0;
    const currentLiabilities = financialData.currentLiabilities || 0;
    
    // Safety check para empresas pré-operacionais ou com ebitda negativo
    if (ebitda <= 0) {
      return {
        status: 'CRITICAL',
        conversionRate: 0,
        alert: 'EBITDA negativo ou nulo, queima operacional de caixa provável.'
      };
    }
    
    const conversionRate = operatingCashFlow / ebitda;
    
    if (conversionRate >= 0.7) {
      return {
        status: 'HEALTHY',
        conversionRate
      };
    } else if (conversionRate >= 0.3) {
      return {
        status: 'ATTENTION',
        conversionRate,
        alert: 'Conversão de caixa moderada. Atenção ao ciclo financeiro e necessidade de capital de giro.'
      };
    } else {
      // < 30% ou Negativo
      // Verificar se é crescimento (ex: receita alta, capital de giro alto)
      const workingCapital = currentAssets - currentLiabilities;
      if (workingCapital > 0 && operatingCashFlow < 0) {
        return {
          status: 'CRITICAL',
          conversionRate,
          alert: 'Crescimento com Risco de Financiamento: Geração operacional negativa pressionando o capital de giro (Lucro não convertido em caixa).'
        };
      }
      
      return {
        status: 'CRITICAL',
        conversionRate,
        alert: 'Baixíssima ou nenhuma conversão de resultado econômico em caixa.'
      };
    }
  }
}
