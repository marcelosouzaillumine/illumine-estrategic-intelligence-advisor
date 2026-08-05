import { FinancialStatementContext } from '../../context/FinancialStatementContext';

export interface CashConversionSignal {
  type: 'PROFIT_WITHOUT_CASH' | 'HEALTHY_CONVERSION' | 'DELAYED_CONVERSION';
  evidence: string[];
}

export class CashConversionEngine {
  public evaluate(context: FinancialStatementContext): CashConversionSignal | null {
    const isNetIncomePositive = context.incomeStatement.margins.net > 0;
    const isOcfNegative = context.cashFlow.operatingCashFlow < 0;
    const isOcfPositive = context.cashFlow.operatingCashFlow > 0;

    if (isNetIncomePositive && isOcfNegative) {
      return {
        type: 'PROFIT_WITHOUT_CASH',
        evidence: ['positive_net_income', 'negative_operating_cash_flow']
      };
    }

    if (isNetIncomePositive && isOcfPositive) {
      return {
        type: 'HEALTHY_CONVERSION',
        evidence: ['positive_net_income', 'positive_operating_cash_flow']
      };
    }

    return null;
  }
}
