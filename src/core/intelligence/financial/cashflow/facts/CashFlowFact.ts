export interface CashFlowFact {
  metric: string; // e.g., "financial.cashflow.operating_cash_flow"
  value: number; // e.g., 850000
  period: string; // e.g., "2025"
  meaning: string; // e.g., "capacidade operacional de geração de caixa"
}
