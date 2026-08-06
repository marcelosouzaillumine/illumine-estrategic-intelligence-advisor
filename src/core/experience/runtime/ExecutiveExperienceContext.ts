import { IntelligenceSource } from '../schema/ExecutiveProductSchema';
import { FinancialPositionIntelligenceContract } from '../contracts/FinancialPositionPureViewModel';

export interface CalculationReference {
  metric: string;
  formula: string;
  traceId: string;
}

export interface ExecutiveExperienceContext {
  productId: string;
  tenantId: string;
  
  // The data payload injected by engines, strongly typed.
  intelligence: {
    financialPosition?: FinancialPositionIntelligenceContract;
    financialPerformance?: any;
    cashFlow?: any;
  };
  
  evidence: {
    sources: IntelligenceSource[];
    calculations?: CalculationReference[];
  };
  
  viewState?: {
    period: string;
    comparisonPeriod?: string;
  };
}
