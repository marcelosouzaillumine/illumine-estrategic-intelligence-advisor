import { BalanceSheetContext } from './BalanceSheetContext';
import { IncomeStatementContext } from './IncomeStatementContext';
import { CashFlowContext } from './CashFlowContext';

// Import relationship once implemented
// import { FinancialRelationship } from '../graph/FinancialRelationshipGraph';

export interface FinancialStatementContext {
  tenantId: string;
  companyId: string;
  industry: string;
  period: string; // e.g., '2025' or 'Q1-2025'
  currency: string;
  
  balanceSheet: BalanceSheetContext;
  incomeStatement: IncomeStatementContext;
  cashFlow: CashFlowContext;
  
  relationships: any[]; // To be strongly typed to FinancialRelationship
}
