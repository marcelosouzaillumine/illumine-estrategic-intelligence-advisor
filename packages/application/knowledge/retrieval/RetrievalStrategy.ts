export interface RetrievalStrategy {
  name: string; // e.g., 'financial_strategy', 'commercial_strategy'
  filters: any; // e.g., { domain: 'financial', status: 'active' }
  boostFactors: Record<string, number>; // e.g., { "decisions": 1.5, "documents": 1.0 }
}

export const FinancialStrategy: RetrievalStrategy = {
  name: "financial_strategy",
  filters: { domain: "financial" },
  boostFactors: { "metric": 2.0, "decision": 1.5 }
};
