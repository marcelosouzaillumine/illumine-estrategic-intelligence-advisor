import { IntegrityBlocker } from '../FinancialIntegrityResult';

export class BalanceSheetValidator {
  /**
   * Rule Group 2 — Patrimônio: Equação patrimonial
   * Ativo = Passivo + Patrimônio Líquido
   */
  public static validate(financialData: any): IntegrityBlocker | null {
    if (financialData.assets !== undefined && financialData.liabilities !== undefined && financialData.equity !== undefined) {
      const calculatedAssets = financialData.liabilities + financialData.equity;
      const difference = Math.abs(financialData.assets - calculatedAssets);
      
      // Tolerância de 0.5%
      const tolerance = financialData.assets * 0.005;

      if (difference > tolerance) {
        return {
          severity: 'CRITICAL',
          category: 'STRUCTURAL',
          rule: 'BALANCE_SHEET_INCONSISTENCY',
          message: `A equação patrimonial fundamental foi violada (Ativo ≠ Passivo + PL). Diferença de ${difference} ultrapassa tolerância de 0.5%.`
        };
      }
    }
    return null;
  }
}
