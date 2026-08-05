import { ExecutiveInsight } from './executive-insight.types';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ExecutiveDataPayload } from './executive-snapshot.types';

export interface CfoPerformanceData extends ExecutiveDataPayload {
  revenue: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    percentageChange: number;
  };
  ebitda: {
    value: number;
    margin: number;
    trend: 'up' | 'down' | 'neutral';
  };
  cashFlow: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  insights: ExecutiveInsight[];
}

export interface CfoCashIntelligenceData extends ExecutiveDataPayload {
  freeCashFlow: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  liquidity: {
    risk: 'low' | 'medium' | 'high';
    runwayDays: number;
  };
  forecast: {
    monthly: Record<string, { inflows: number; outflows: number; netCash: number }>;
  };
  insights: ExecutiveInsight[];
}

export interface CfoPlanningData extends ExecutiveDataPayload {
  budgetVariance: {
    value: number;
    percentage: number;
  };
  forecastVsTarget: {
    percentage: number;
  };
  scenarios: Record<string, { actual: number; budget: number; forecast: number }>;
  insights: ExecutiveInsight[];
}

export interface CfoWorkingCapitalData extends ExecutiveDataPayload {
  receivables: {
    totalOutstanding: number;
    overdueAmount: number;
    averageCollectionDays: number;
  };
  payables: {
    totalOutstanding: number;
    averagePaymentDays: number;
  };
  cashConversionCycle: {
    dso: number;
    dio: number;
    dpo: number;
    cycleDays: number;
  };
  agingRisk: {
    severity: 'low' | 'medium' | 'high';
    exposure: number;
  };
  insights: ExecutiveInsight[];
}

/**
 * Interface defining the standard Intelligence Provider for the CFO Office.
 * Any concrete provider (Mock, Firebase, etc) must implement this.
 */
export interface CfoIntelligenceProvider {
  getPerformance(context: ExecutiveContext): Promise<CfoPerformanceData>;
  getCashIntelligence(context: ExecutiveContext): Promise<CfoCashIntelligenceData>;
  getPlanning(context: ExecutiveContext): Promise<CfoPlanningData>;
  getWorkingCapital(context: ExecutiveContext): Promise<CfoWorkingCapitalData>;
}
