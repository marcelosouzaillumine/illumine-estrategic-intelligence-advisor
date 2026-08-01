import { IntegrityBlocker } from '../FinancialIntegrityResult';

import { SolvencyIntelligence } from '../../contracts/FinancialIntelligenceAssessment';

export class BalanceSheetValidator {
  /**
   * Rule Group 2 — Patrimônio e Estrutura de Capital: Balance Intelligence
   * Valida Equação Patrimonial e realiza Análise de Solvência Estrutural
   */
  public static validate(financialData: any): { blockers: IntegrityBlocker[], solvency: SolvencyIntelligence | null } {
    const blockers: IntegrityBlocker[] = [];
    let solvency: SolvencyIntelligence | null = null;
    
    if (financialData.assets !== undefined && financialData.liabilities !== undefined && financialData.equity !== undefined) {
      const calculatedAssets = financialData.liabilities + financialData.equity;
      const difference = Math.abs(financialData.assets - calculatedAssets);
      
      // Tolerância de 0.5%
      const tolerance = financialData.assets * 0.005;

      if (difference > tolerance) {
        blockers.push({
          severity: 'CRITICAL',
          category: 'STRUCTURAL',
          rule: 'BALANCE_SHEET_INCONSISTENCY',
          message: `A equação patrimonial fundamental foi violada (Ativo ≠ Passivo + PL). Diferença de ${difference} ultrapassa tolerância.`
        });
      }
      
      // Structural Solvency Analysis
      const currentAssets = financialData.currentAssets || 0;
      const currentLiabilities = financialData.currentLiabilities || 0;
      
      const liquidityRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 1;
      const thirdPartyDependence = financialData.assets > 0 ? financialData.liabilities / financialData.assets : 0;
      const equityToAssets = financialData.assets > 0 ? financialData.equity / financialData.assets : 0;
      const workingCapital = currentAssets - currentLiabilities;
      
      const alerts: string[] = [];
      let status: 'STABLE' | 'VULNERABLE' | 'CRITICAL' = 'STABLE';
      
      if (liquidityRatio < 1) {
        alerts.push('Liquidez corrente abaixo de 1 (risco de insolvência no curto prazo).');
        status = 'VULNERABLE';
      }
      if (financialData.equity < 0) {
        alerts.push('Passivo a Descoberto (PL negativo).');
        status = 'CRITICAL';
      }
      if (thirdPartyDependence > 0.7) {
        alerts.push('Alta dependência de capital de terceiros (>70%).');
        if (status !== 'CRITICAL') status = 'VULNERABLE';
      }
      
      solvency = {
        liquidityRatio,
        thirdPartyDependence,
        equityToAssets,
        workingCapital,
        status,
        alerts
      };
    }
    
    return { blockers, solvency };
  }
}
