import { FinancialStatementContext } from '../../context/FinancialStatementContext';

export interface CashSustainabilitySignal {
  type: 'CASH_DEPENDENCY_RISK' | 'SELF_SUSTAINABLE' | 'DEBT_REDUCTION';
  evidence: string[];
}

export class CashSustainabilityEngine {
  public evaluate(context: FinancialStatementContext): CashSustainabilitySignal | null {
    const isOcfNegative = context.cashFlow.operatingCashFlow < 0;
    
    // Simplification for the foundation: simulating debt increase via positive financing cash flow 
    // coupled with overall short/long term debt metrics in a real scenario
    const isDebtIncreasing = context.cashFlow.financingCashFlow > 0; 
    
    if (isOcfNegative && isDebtIncreasing) {
      return {
        type: 'CASH_DEPENDENCY_RISK',
        evidence: ['negative_operating_cash_flow', 'increasing_debt']
      };
    }

    const isOcfPositive = context.cashFlow.operatingCashFlow > 0;
    const isDebtDecreasing = context.cashFlow.financingCashFlow < 0;

    if (isOcfPositive && isDebtDecreasing) {
      return {
        type: 'DEBT_REDUCTION',
        evidence: ['positive_operating_cash_flow', 'decreasing_debt']
      };
    }

    if (isOcfPositive && context.cashFlow.freeCashFlow > 0) {
      return {
        type: 'SELF_SUSTAINABLE',
        evidence: ['positive_operating_cash_flow', 'positive_free_cash_flow']
      };
    }

    return null;
  }
}
