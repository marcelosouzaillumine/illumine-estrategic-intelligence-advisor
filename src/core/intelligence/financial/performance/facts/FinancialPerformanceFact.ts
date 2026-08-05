export interface FinancialPerformanceFact {
  metric: string; // e.g., "financial.performance.revenue_growth"
  value: number; // e.g., 35
  period: {
    current: string; // e.g., "2025"
    previous?: string; // e.g., "2024"
  };
  meaning: string; // e.g., "crescimento econômico da operação"
  source: 'INCOME_STATEMENT' | 'CASH_FLOW' | 'CALCULATED';
}
