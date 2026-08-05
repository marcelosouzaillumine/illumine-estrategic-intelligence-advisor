import { ExecutiveInsight } from './executive-insight.types';
import { ExecutiveDataPayload } from './executive-snapshot.types';

export interface CommercialHealthScore extends ExecutiveDataPayload {
  overallScore: number; // 0-100
  revenueGrowthScore: number;
  pipelineCoverageScore: number;
  conversionEfficiencyScore: number;
  customerRetentionScore: number;
  expansionPotentialScore: number;
  criticalInsights: ExecutiveInsight[];
}

export interface CommercialPerformanceData extends ExecutiveDataPayload {
  revenue: {
    actual: number;
    target: number;
    yoyGrowth: number;
  };
  metrics: {
    averageTicket: number;
    marginPerCustomer: number;
    recurringRevenueRatio: number;
  };
  insights: ExecutiveInsight[];
}

export interface PipelineIntelligenceData extends ExecutiveDataPayload {
  pipeline: {
    totalValue: number;
    weightedValue: number;
    coverageRatio: number; // Pipeline / Target
  };
  efficiency: {
    conversionRate: number; // %
    averageSalesCycle: number; // days
  };
  bottlenecks: string[];
  insights: ExecutiveInsight[];
}

export interface CustomerIntelligenceData extends ExecutiveDataPayload {
  base: {
    activeCustomers: number;
    retentionRate: number; // %
    churnRiskValue: number;
  };
  strategy: {
    strategicCustomersCount: number;
    expansionPotentialValue: number;
  };
  insights: ExecutiveInsight[];
}

export interface MarketOpportunityData extends ExecutiveDataPayload {
  opportunities: {
    crossSellPotential: number;
    newMarketsTAM: number; // Total Addressable Market
  };
  initiatives: string[];
  insights: ExecutiveInsight[];
}

export interface CommercialExecutiveSummaryData extends ExecutiveDataPayload {
  healthScore: number;
  topOpportunities: string[];
  commercialRisks: string[];
  recommendedActions: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  criticalInsights: ExecutiveInsight[];
}
