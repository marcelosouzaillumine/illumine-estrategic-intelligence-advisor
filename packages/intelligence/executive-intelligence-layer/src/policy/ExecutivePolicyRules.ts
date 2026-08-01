import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';
import { ExecutiveInsightCategory } from '../contracts/ExecutiveDiagnosis';

export interface ExecutivePolicy {
  decisionMode: "ACCELERATE" | "OPTIMIZE" | "STABILIZE" | "PRESERVE";
  allowedActions: string[];
  blockedActions: string[];
  allowedInsights: ExecutiveInsightCategory[];
  blockedInsights: ExecutiveInsightCategory[];
  policyVersion: string;
}

export class ExecutivePolicyRules {
  public static readonly VERSION = "v3.0";

  public static getPolicyForState(state: ExecutiveFinancialState): ExecutivePolicy {
    switch (state.status) {
      case 'CRITICAL':
        return {
          decisionMode: 'PRESERVE',
          allowedActions: ['Preservação de Caixa', 'Renegociação', 'Capitalização', 'Alongamento'],
          blockedActions: ['Dividendos', 'Aquisições', 'Expansão', 'CAPEX elevado'],
          allowedInsights: ['LIQUIDITY', 'SOLVENCY', 'CASH', 'CONTINUITY'],
          blockedInsights: ['GROWTH', 'DIVIDENDS', 'PROFITABILITY'],
          policyVersion: this.VERSION
        };
      case 'STRESSED':
        return {
          decisionMode: 'STABILIZE',
          allowedActions: ['Otimização de Custos', 'Retenção de Caixa', 'Reestruturação Leve'],
          blockedActions: ['Dividendos agressivos', 'Expansão desestruturada'],
          allowedInsights: ['LIQUIDITY', 'WORKING_CAPITAL', 'SOLVENCY', 'PROFITABILITY'],
          blockedInsights: ['GROWTH', 'DIVIDENDS'],
          policyVersion: this.VERSION
        };
      case 'ATTENTION':
        return {
          decisionMode: 'OPTIMIZE',
          allowedActions: ['Capex Estratégico', 'Eficiência Operacional', 'Distribuição Moderada'],
          blockedActions: ['Alavancagem Agressiva'],
          allowedInsights: ['PROFITABILITY', 'WORKING_CAPITAL', 'GROWTH', 'LIQUIDITY'],
          blockedInsights: [],
          policyVersion: this.VERSION
        };
      case 'HEALTHY':
        return {
          decisionMode: 'ACCELERATE',
          allowedActions: ['Expansão', 'Distribuição de Dividendos', 'M&A', 'Aceleração de Crescimento'],
          blockedActions: [],
          allowedInsights: ['GROWTH', 'DIVIDENDS', 'PROFITABILITY', 'CASH', 'CAPITAL'],
          blockedInsights: [],
          policyVersion: this.VERSION
        };
    }
  }
}
