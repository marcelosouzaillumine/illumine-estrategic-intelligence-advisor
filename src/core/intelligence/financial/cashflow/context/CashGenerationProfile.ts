export type CashGenerationProfileType = 
  | 'CASH_GENERATOR' // Operating Cash Flow +, Free Cash Flow +, Low Debt Dependency
  | 'GROWTH_CONSUMER' // Revenue Growth +, EBITDA Growth +, Negative Free Cash Flow
  | 'CASH_STRESS' // Operating Cash Flow -, Debt Increasing
  | 'CAPITAL_INVESTOR' // High CAPEX + Future Growth Signals
  | 'UNKNOWN';

export interface CashGenerationProfile {
  type: CashGenerationProfileType;
  description: string;
  keyDrivers: string[];
  confidence: number;
}
