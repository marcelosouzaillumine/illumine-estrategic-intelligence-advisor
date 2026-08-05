import { NormalizedBalanceSheet } from '../models/NormalizedBalanceSheet';
import { RiskExposure } from '../../../../core/intelligence/contracts/RiskExposure';

export interface FinancialRiskRule {
  id: string;
  category: string;
  evaluate: (data: NormalizedBalanceSheet) => RiskExposure | null;
}

export const FinancialRiskRules: FinancialRiskRule[] = [
  {
    id: 'inventory_concentration',
    category: 'Concentração de Estoques',
    evaluate: (data: NormalizedBalanceSheet) => {
      const inventoryRatio = data.assets.total > 0 ? (data.assets.inventory / data.assets.total) : 0;
      if (inventoryRatio >= 0.5) {
        return {
          id: 'inventory_concentration_critical',
          category: 'Concentração de Estoques',
          severity: 'CRITICAL',
          metric: 'Estoques / Ativo Total',
          value: inventoryRatio,
          triggerCondition: '>= 50%',
          message: 'Estoque representa mais de 50% dos ativos totais. Risco severo de obsolescência e imobilização de capital.'
        };
      } else if (inventoryRatio >= 0.35) {
        return {
          id: 'inventory_concentration_high',
          category: 'Concentração de Estoques',
          severity: 'HIGH',
          metric: 'Estoques / Ativo Total',
          value: inventoryRatio,
          triggerCondition: '>= 35%',
          message: 'Concentração de estoques elevada. Sugere revisão de política de compras e giro de estoque.'
        };
      } else if (inventoryRatio >= 0.20) {
        return {
          id: 'inventory_concentration_monitor',
          category: 'Concentração de Estoques',
          severity: 'MEDIUM',
          metric: 'Estoques / Ativo Total',
          value: inventoryRatio,
          triggerCondition: '>= 20%',
          message: 'Concentração de estoques em nível de atenção.'
        };
      }
      return null;
    }
  },
  {
    id: 'excess_liquidity',
    category: 'Imobilização em Caixa',
    evaluate: (data: NormalizedBalanceSheet) => {
      const cashRatio = data.assets.total > 0 ? (data.assets.cashAndEquivalents / data.assets.total) : 0;
      if (cashRatio >= 0.5) {
        return {
          id: 'excess_liquidity_eval',
          category: 'Imobilização em Caixa',
          severity: 'MEDIUM',
          metric: 'Caixa / Ativo Total',
          value: cashRatio,
          triggerCondition: '>= 50%',
          message: 'Excesso de liquidez. Mais de 50% dos ativos em caixa podem indicar ineficiência na alocação de capital.'
        };
      }
      return null;
    }
  },
  {
    id: 'short_term_pressure',
    category: 'Pressão de Curto Prazo',
    evaluate: (data: NormalizedBalanceSheet) => {
      const shortTermDebtRatio = data.liabilities.total > 0 ? (data.liabilities.currentLiabilities / data.liabilities.total) : 0;
      const currentLiquidity = data.liabilities.currentLiabilities > 0 ? (data.assets.currentAssets / data.liabilities.currentLiabilities) : 0;
      
      if (shortTermDebtRatio > 0.8 && currentLiquidity < 1.5) {
        return {
          id: 'short_term_pressure_critical',
          category: 'Pressão de Curto Prazo',
          severity: 'CRITICAL',
          metric: 'PC / Passivo Total & Liquidez Corrente',
          value: shortTermDebtRatio,
          triggerCondition: 'PC > 80% & Liquidez < 1.5',
          message: 'Forte pressão de curto prazo combinada com margem estreita de liquidez.'
        };
      }
      return null;
    }
  }
];
