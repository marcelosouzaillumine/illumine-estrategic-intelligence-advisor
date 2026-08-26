import { ExecutiveIntelligenceOutput } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { FinancialPositionIntelligenceContract } from '../../contracts/FinancialPositionIntelligenceContract';

export interface FinancialIntelligencePort {
  analyzeBalanceSheet(rawData: any): FinancialPositionIntelligenceContract;
}
