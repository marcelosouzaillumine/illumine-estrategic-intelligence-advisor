import { FinancialStatementContext } from '../../context/FinancialStatementContext';
import { FinancialPerformanceContext } from '../../performance/context/FinancialPerformanceContext';

export interface CashFlowRelationshipSignal {
  type: 'WORKING_CAPITAL_PRESSURE' | 'HEALTHY_WORKING_CAPITAL' | 'CASH_GENERATION_DIVERGENCE';
  evidence: string[];
}

export class CashFlowRelationshipEngine {
  public evaluate(perfContext: FinancialPerformanceContext, fullContext: FinancialStatementContext): CashFlowRelationshipSignal | null {
    const isRevenueGrowing = perfContext.revenueGrowth > 5;
    const isEbitdaGrowing = true; // Assuming EBITDA is growing
    
    // Simulating Accounts Receivable growth vs Revenue growth
    // For this foundation, we just mock the condition based on receivables size
    const receivables = fullContext.balanceSheet.assets.receivables;
    const revenue = fullContext.incomeStatement.revenue.net;
    const isReceivablesHigh = receivables > revenue * 0.3; // Just a mock rule

    const isOcfNegative = fullContext.cashFlow.operatingCashFlow < 0;

    if (isRevenueGrowing && isEbitdaGrowing && isReceivablesHigh && isOcfNegative) {
      return {
        type: 'WORKING_CAPITAL_PRESSURE',
        evidence: ['high_revenue_growth', 'high_receivables', 'negative_operating_cash']
      };
    }

    return null;
  }
}
