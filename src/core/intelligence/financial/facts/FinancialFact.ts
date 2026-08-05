export interface FinancialFact {
  metric: string;
  value: number | string;
  period: string | number; // e.g., '2025' or 'Q1-2025'
  source: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'EXTERNAL_MARKET';
  unit?: 'PERCENTAGE' | 'ABSOLUTE' | 'MULTIPLIER';
}
