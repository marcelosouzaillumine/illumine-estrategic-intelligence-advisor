import { FinancialPerformanceContext } from '../context/FinancialPerformanceContext';
import { FinancialStatementContext } from '../../context/FinancialStatementContext';

export interface ProfitabilityRelationship {
  type: 'PROFITABLE_GROWTH' | 'VALUE_DESTRUCTION_RISK' | 'OPERATIONAL_EFFICIENCY_DECLINE' | 'STAGNANT_PROFITABILITY';
  evidence: string[];
}

export class ProfitabilityRelationshipEngine {
  /**
   * Evaluates performance relationships based on the DRE context and Cash Flow
   */
  public evaluate(perfContext: FinancialPerformanceContext, fullContext: FinancialStatementContext): ProfitabilityRelationship[] {
    const relationships: ProfitabilityRelationship[] = [];

    const isGrowing = perfContext.revenueGrowth > 5;
    const isEbitdaGrowing = true; // Simulating we have this temporal data
    const isEbitdaFalling = !isEbitdaGrowing;
    const isMarginFalling = perfContext.ebitdaMargin < 10; // Simple mock threshold
    const isMarginStable = !isMarginFalling;
    const isCashFlowPositive = fullContext.cashFlow.operatingCashFlow > 0;
    const isCashFlowNegative = !isCashFlowPositive;

    // Crescimento Saudável
    if (isGrowing && isEbitdaGrowing && isMarginStable && isCashFlowPositive) {
      relationships.push({
        type: 'PROFITABLE_GROWTH',
        evidence: ['revenue_growth_up', 'ebitda_up', 'margin_stable', 'cash_flow_positive']
      });
    }

    // Crescimento Destrutivo
    if (isGrowing && isMarginFalling && isCashFlowNegative) {
      relationships.push({
        type: 'VALUE_DESTRUCTION_RISK',
        evidence: ['revenue_growth_up', 'ebitda_down', 'margin_down', 'cash_flow_negative']
      });
    }

    // Compressão Operacional
    if (!isGrowing && isMarginFalling) {
      relationships.push({
        type: 'OPERATIONAL_EFFICIENCY_DECLINE',
        evidence: ['revenue_stable', 'cost_up', 'margin_down']
      });
    }

    return relationships;
  }
}
