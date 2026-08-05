import { ExecutiveIntelligenceOutput } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';

export interface FinancialIntelligencePort {
  analyzeBalanceSheet(rawData: any): ExecutiveIntelligenceOutput;
}
