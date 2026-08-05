import { IntelligenceSource } from '../schema/ExecutiveProductSchema';

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
    financialPosition?: any; // To be mapped to a specific context type if needed
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
