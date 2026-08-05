import { FinancialFact } from '../facts/FinancialFact';

export interface CashFlowContext {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  freeCashFlow: number;
  netChangeInCash: number;
  facts: FinancialFact[];
}
