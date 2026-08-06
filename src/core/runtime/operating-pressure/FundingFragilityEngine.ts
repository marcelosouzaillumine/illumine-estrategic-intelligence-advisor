// src/core/runtime/operating-pressure/FundingFragilityEngine.ts

import { PressureRuntimeInput, FundingFragilityOutput } from './operating-pressure-types';

export class FundingFragilityEngine {
  public static evaluate(input: PressureRuntimeInput): FundingFragilityOutput {
    const current = input.currentCycle;
    const warnings: string[] = [];
    let score = 0;

    // 1. Rollover Pressure (short-term debt compared to total debt)
    const rolloverPressureRatio = current.totalDebt > 0 ? current.shortTermDebt / current.totalDebt : 0;
    if (rolloverPressureRatio > 0.7 && current.totalDebt > 0) {
      score += 30;
      warnings.push(`Elevada pressão de rolagem de dívidas no ciclo imediato (${(rolloverPressureRatio * 100).toFixed(1)}% do total)`);
    } else if (rolloverPressureRatio > 0.4 && current.totalDebt > 0) {
      score += 15;
      warnings.push(`Pressão moderada de rolagem de obrigações de ciclo imediato (${(rolloverPressureRatio * 100).toFixed(1)}% do total)`);
    }

    // 2. Debt vs Cash cover (short-term debt vs available cash)
    if (current.shortTermDebt > current.availableCash) {
      score += 35;
      warnings.push('Obrigações de ciclo imediato excedem o saldo de caixa disponível (dependência de refinanciamento)');
    }

    // 3. Overall debt dependency (total debt vs annual revenue)
    const debtToRevenue = current.revenue > 0 ? current.totalDebt / current.revenue : 0;
    let fundingDependency: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NONE';

    if (debtToRevenue > 0.8) {
      score += 25;
      fundingDependency = 'HIGH';
      warnings.push(`Alta dependência estrutural de capital de terceiros (${(debtToRevenue * 100).toFixed(1)}% da receita)`);
    } else if (debtToRevenue > 0.4) {
      score += 15;
      fundingDependency = 'MEDIUM';
      warnings.push(`Dependência intermediária de endividamento corporativo (${(debtToRevenue * 100).toFixed(1)}% da receita)`);
    } else if (debtToRevenue > 0.1) {
      fundingDependency = 'LOW';
    }

    // 4. Payables vs available cash
    if (current.payables > current.availableCash * 1.5) {
      score += 10;
      warnings.push('Fornecedores e contas a pagar elevados em relação à liquidez operacional imediata');
    }

    const fragilityScore = Math.min(Math.max(score, 0), 100);

    let rolloverRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (fragilityScore > 75) {
      rolloverRiskLevel = 'CRITICAL';
    } else if (fragilityScore > 50) {
      rolloverRiskLevel = 'HIGH';
    } else if (fragilityScore > 25) {
      rolloverRiskLevel = 'MEDIUM';
    }

    return {
      fragilityScore,
      fundingDependency,
      rolloverPressureRatio,
      rolloverRiskLevel,
      warnings
    };
  }
}
