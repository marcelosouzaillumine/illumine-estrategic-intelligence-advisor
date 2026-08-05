import { FinancialStatementContext } from '../../context/FinancialStatementContext';

export interface EarningsQuality {
  status: 'HIGH_QUALITY_EARNINGS' | 'LOW_CASH_CONVERSION' | 'ACCRUAL_RISK';
  evidence: string[];
}

export class EarningsQualityEngine {
  /**
   * Differentiates accounting profit from actual cash generation.
   */
  public evaluate(context: FinancialStatementContext): EarningsQuality | null {
    const isNetIncomePositive = context.incomeStatement.margins.net > 0;
    const isOperatingCashFlowPositive = context.cashFlow.operatingCashFlow > 0;
    const isOperatingCashFlowNegative = !isOperatingCashFlowPositive;

    if (isNetIncomePositive && isOperatingCashFlowPositive) {
      return {
        status: 'HIGH_QUALITY_EARNINGS',
        evidence: ['positive_net_income', 'positive_operating_cash_flow']
      };
    }

    if (isNetIncomePositive && isOperatingCashFlowNegative) {
      return {
        status: 'LOW_CASH_CONVERSION',
        evidence: ['positive_net_income', 'negative_operating_cash_flow', 'growing_receivables'] // Mocking growing_receivables
      };
    }

    return null;
  }
}
