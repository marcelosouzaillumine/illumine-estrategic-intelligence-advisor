import { FinancialFact } from '../facts/FinancialFact';

export interface IncomeStatementContext {
  revenue: {
    gross: number;
    net: number;
  };
  costs: {
    cogs: number;
  };
  expenses: {
    operating: number;
    financial: number;
  };
  margins: {
    gross: number;
    ebitda: number;
    operating: number;
    net: number;
  };
  facts: FinancialFact[];
}
