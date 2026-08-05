export type PerformanceProfileType = 
  | 'GROWTH_LEADER' // Revenue ↑, EBITDA ↑, Cash Conversion ↑
  | 'GROWTH_UNDER_PRESSURE' // Revenue ↑, EBITDA ↓, Margin ↓, Cash ↓
  | 'MATURE_CASH_GENERATOR' // Revenue ~ (stable), Margin High, Cash Strong
  | 'MARGIN_COMPRESSION' // Revenue ~, Cost ↑, Margin ↓
  | 'VALUE_DESTROYER' // Revenue ↓, EBITDA negative, Cash negative
  | 'UNKNOWN';

export interface FinancialPerformanceProfile {
  type: PerformanceProfileType;
  description: string;
  keyDrivers: string[]; // e.g., ["High Revenue Growth", "Strong Cash Conversion"]
  confidence: number;
}
