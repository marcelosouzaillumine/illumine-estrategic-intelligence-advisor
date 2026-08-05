import { FinancialStatementContext } from '../context/FinancialStatementContext';

export interface FinancialRelationship {
  type: string; // e.g., 'VALUE_EROSION_RISK', 'CASH_TRAP'
  evidence: string[]; // e.g., ['strong_equity', 'margin_decline', 'negative_operating_cash']
  confidence: number;
}

export class FinancialRelationshipGraph {
  
  /**
   * Evaluates macro-relationships crossing Balance Sheet, Income Statement, and Cash Flow.
   */
  public evaluate(context: FinancialStatementContext): FinancialRelationship[] {
    const relationships: FinancialRelationship[] = [];

    // Simulate analysis logic connecting the three statements
    
    // Example: Value Erosion Risk
    // High Equity (Balance Sheet) + Declining Margin (Income Statement) + Negative Op. Cash (Cash Flow)
    const isEquityStrong = context.balanceSheet.equity.total > context.balanceSheet.liabilities.total;
    const isMarginLow = context.incomeStatement.margins.ebitda < 10; // Mock threshold
    const isCashFlowNegative = context.cashFlow.operatingCashFlow < 0;

    if (isEquityStrong && isMarginLow && isCashFlowNegative) {
      relationships.push({
        type: 'VALUE_EROSION_RISK',
        evidence: [
          'strong_equity', 
          'margin_decline', 
          'negative_operating_cash'
        ],
        confidence: 0.91
      });
    }

    // Example: Cash Trap Risk
    // High Profitability (Income Statement) + High Inventory (Balance Sheet) + Low Free Cash Flow (Cash Flow)
    const isProfitHigh = context.incomeStatement.margins.net > 15;
    const isInventoryHigh = context.balanceSheet.assets.inventory > (context.balanceSheet.assets.total * 0.3);
    const isFcfLow = context.cashFlow.freeCashFlow < (context.incomeStatement.revenue.net * 0.05);

    if (isProfitHigh && isInventoryHigh && isFcfLow) {
      relationships.push({
        type: 'CASH_TRAP',
        evidence: [
          'high_profitability',
          'high_inventory_concentration',
          'low_free_cash_flow'
        ],
        confidence: 0.88
      });
    }

    return relationships;
  }
}
