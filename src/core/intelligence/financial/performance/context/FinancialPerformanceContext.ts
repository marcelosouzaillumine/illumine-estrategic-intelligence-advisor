import { FinancialPerformanceFact } from '../facts/FinancialPerformanceFact';
import { FinancialPerformanceProfile } from './FinancialPerformanceProfile';

export interface FinancialPerformanceContext {
  revenue: number;
  revenueGrowth: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  operatingIncome: number;
  netIncome: number;
  
  profitabilityProfile: FinancialPerformanceProfile;
  performanceSignals: string[]; // e.g., ["PROFITABLE_GROWTH", "LOW_CASH_CONVERSION"]
  
  facts: FinancialPerformanceFact[];
}
