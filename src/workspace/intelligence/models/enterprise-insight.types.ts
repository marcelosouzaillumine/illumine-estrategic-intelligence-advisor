export type ExecutiveOffice = 'ceo' | 'cfo' | 'coo' | 'commercial' | 'people' | 'governance' | 'risk' | 'innovation';

export interface IntelligenceEvidence {
  id: string;
  metricId: string;
  metricName: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}

export interface CausalHypothesis {
  id: string;
  description: string;
  sourceNodeId: string;
  targetNodeId: string;
  confidenceScore: number; // 0 to 1
}

export interface BusinessImpact {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedMetrics: string[];
  estimatedFinancialValue?: number;
}

export interface DecisionRecommendation {
  id: string;
  action: string;
  expectedOutcome: string;
  targetOffice: ExecutiveOffice;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export type EnterpriseInsightLifecycle = 'DETECTED' | 'ANALYZING' | 'VALIDATED' | 'ACTIONED' | 'RESOLVED';

export interface EnterpriseInsight {
  id: string;
  title: string;
  narrative: string;
  sourceOffice: ExecutiveOffice;
  affectedOffices: ExecutiveOffice[];
  evidence: IntelligenceEvidence[];
  causalHypothesis: CausalHypothesis[];
  businessImpact: BusinessImpact;
  recommendedActions: DecisionRecommendation[];
  confidenceScore: number; // 0 to 1
  lifecycle: EnterpriseInsightLifecycle;
  detectedAt: string;
  lastUpdatedAt: string;
}
