import { CashFlowFact } from '../facts/CashFlowFact';
import { CashGenerationProfile } from './CashGenerationProfile';

export interface CashFlowIntelligenceContext {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  freeCashFlow: number;
  capex: number;
  
  cashConversionRate: number; // e.g., OCF / EBITDA
  
  cashGenerationProfile: CashGenerationProfile;
  cashSignals: string[]; // e.g., ["PROFIT_WITHOUT_CASH", "CASH_DEPENDENCY_RISK"]
  
  facts: CashFlowFact[];
}
