import { ExecutiveInsight } from './executive-insight.types';

export interface ExecutivePeopleHealthScore {
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  components: {
    workforceCapacity: number; // 25%
    culture: number; // 20%
    leadership: number; // 20%
    capabilityDevelopment: number; // 15%
    financialImpact: number; // 10%
    organizationalResilience: number; // 10%
  };
}

export type OrganizationalMaturityLevel = 'Initial' | 'Managed' | 'Standardized' | 'Optimized' | 'Intelligent';

export interface PeopleExecutiveDataPayload<T> {
  metadata: {
    generatedAt: string;
    office: 'people';
    capability: string;
    version: string;
  };
  healthScore?: ExecutivePeopleHealthScore;
  maturityLevel?: OrganizationalMaturityLevel;
  insights: ExecutiveInsight[];
  risks: string[];
  recommendations: string[];
  metrics: T;
}

export interface WorkforceIntelligenceData {
  headcount: number;
  openPositions: number;
  turnoverRate: number; // e.g., 0.05 for 5%
  retentionRate: number;
  absenteeismRate: number;
  timeToFill: number; // in days
}

export interface OrganizationalCultureData {
  eNPS: number;
  cultureAlignmentScore: number;
  diversityIndex: number;
  employeeSatisfaction: number;
  burnoutRiskIndex: number; // High means high risk
}

export interface LeadershipIntelligenceData {
  leadershipReadiness: number; // 0-1
  successionPipelineCoverage: number; // 0-1
  managementToStaffRatio: number;
  leadershipTurnover: number;
  strategicAlignment: number; // 0-1
}

export interface PeopleFinancialImpactData {
  totalPayroll: number;
  revenuePerEmployee: number;
  profitPerEmployee: number;
  laborCostPercentage: number; // against revenue
  laborLiabilitiesRisk: number; // monetary or index
}

export interface CapabilityDevelopmentData {
  trainingAdoptionRate: number; // 0-1
  averageTrainingHours: number;
  skillsGapIndex: number; // 0-100 (lower is better)
  roiOnTraining: number;
  complianceTrainingCompletion: number;
}

export interface OrganizationalIntelligenceData {
  crossFunctionalCollaboration: number; // 0-1
  siloIndex: number; // High means highly siloed
  decisionBottlenecks: number;
  knowledgeConcentrationRisk: number; // High means key person dependency
  agilityIndex: number; // 0-1
}

export interface WorkforceCapacityData {
  installedCapacity: number; // e.g., total man-hours or units
  utilizedCapacity: number;
  overloadIndex: number; // 0-1 (high means team is overworked)
  futureCapacityNeed: number;
  criticalBottlenecks: string[];
}

// Full Summary
export interface PeopleExecutiveSummaryData {
  healthScore: number;
  maturityLevel: OrganizationalMaturityLevel;
  capacityUtilization: number;
  eNPS: number;
  laborCostPercentage: number;
  criticalRisks: string[];
  topBottlenecks: string[];
  criticalInsights: ExecutiveInsight[];
}
