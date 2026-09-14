export interface ExecutiveFinancialState {
  status: "HEALTHY" | "ATTENTION" | "STRESSED" | "CRITICAL";
  liquidity: number;
  equity: number;
  cashConversion: number;
  evidenceIntegrity: "VALIDATED" | "WARNING" | "REJECTED";
}
