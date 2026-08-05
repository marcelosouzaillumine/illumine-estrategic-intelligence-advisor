import { ExecutiveInsight } from './executive-insight.types';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ExecutiveDataPayload } from './executive-snapshot.types';

export interface CeoStrategicPerformanceData extends ExecutiveDataPayload {
  strategicGoals: {
    total: number;
    onTrack: number;
    atRisk: number;
    critical: number;
  };
  businessEvolution: {
    score: number; // 0-100 overall business performance
    trend: 'improving' | 'stable' | 'declining';
  };
  strategicRisks: {
    active: number;
    highImpact: number;
  };
  recommendedActions: {
    id: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    domain: 'finance' | 'commercial' | 'operations' | 'people' | 'governance';
  }[];
  insights: ExecutiveInsight[];
}

export interface CeoGrowthData extends ExecutiveDataPayload {
  revenueGrowth: {
    value: number;
    target: number;
    variance: number;
  };
  customerGrowth: {
    newClients: number;
    churnRate: number;
    netGrowth: number;
  };
  marketExpansion: {
    marketShare: number;
    penetrationRate: number;
  };
  growthConstraints: string[];
  growthDrivers: string[];
  insights: ExecutiveInsight[];
}

export interface CeoRiskOverviewData extends ExecutiveDataPayload {
  financialRisks: { level: 'low' | 'medium' | 'high'; count: number };
  operationalRisks: { level: 'low' | 'medium' | 'high'; count: number };
  strategicRisks: { level: 'low' | 'medium' | 'high'; count: number };
  riskHeatmap: {
    domain: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    description: string;
  }[];
  mitigationActions: string[];
  insights: ExecutiveInsight[];
}

export interface CeoExecutiveSummaryData extends ExecutiveDataPayload {
  overallHealthScore: number;
  criticalInsights: ExecutiveInsight[];
  opportunities: string[];
  decisionsRequired: {
    id: string;
    title: string;
    context: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

/**
 * Interface defining the standard Intelligence Provider for the CEO Office.
 */
export interface CeoIntelligenceProvider {
  getStrategicPerformance(context: ExecutiveContext): Promise<CeoStrategicPerformanceData>;
  getGrowthIntelligence(context: ExecutiveContext): Promise<CeoGrowthData>;
  getRiskOverview(context: ExecutiveContext): Promise<CeoRiskOverviewData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<CeoExecutiveSummaryData>;
}
