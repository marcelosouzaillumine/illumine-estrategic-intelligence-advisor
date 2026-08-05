import { FinancialFact } from '../facts/FinancialFact';

export interface BalanceSheetContext {
  assets: {
    total: number;
    current: number;
    cashAndEquivalents: number;
    inventory: number;
    receivables: number;
  };
  liabilities: {
    total: number;
    current: number;
    shortTermDebt: number;
    longTermDebt: number;
  };
  equity: {
    total: number;
    retainedEarnings: number;
  };
  facts: FinancialFact[];
}
