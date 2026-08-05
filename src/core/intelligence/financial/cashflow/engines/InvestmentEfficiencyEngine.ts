import { FinancialStatementContext } from '../../context/FinancialStatementContext';

export interface InvestmentEfficiencySignal {
  type: 'STRATEGIC_INVESTMENT' | 'INVESTMENT_EFFICIENCY_RISK';
  evidence: string[];
}

export class InvestmentEfficiencyEngine {
  public evaluate(context: FinancialStatementContext, revenueGrowth: number): InvestmentEfficiencySignal | null {
    // Assuming capex is mapped as negative investing cash flow or derived metric
    const capexAbsolute = Math.abs(context.cashFlow.investingCashFlow); 
    const isCapexHigh = capexAbsolute > (context.incomeStatement.revenue.net * 0.1); // High if > 10% of revenue
    
    const isGrowthHigh = revenueGrowth > 10;
    const isGrowthLow = revenueGrowth < 5;

    if (isCapexHigh && isGrowthHigh) {
      return {
        type: 'STRATEGIC_INVESTMENT',
        evidence: ['high_capex', 'high_revenue_growth']
      };
    }

    if (isCapexHigh && isGrowthLow) {
      return {
        type: 'INVESTMENT_EFFICIENCY_RISK',
        evidence: ['high_capex', 'low_revenue_growth']
      };
    }

    return null;
  }
}
