import { ExecutiveInsight } from './executive-insight.types';

export type RiskTrend = 'improving' | 'stable' | 'deteriorating';

export interface ExecutiveRiskHealthScore {
  overallScore: number;
  strategicRiskScore: number; // 25%
  operationalRiskScore: number; // 20%
  financialRiskScore: number; // 20%
  complianceRiskScore: number; // 20%
  controlMaturityScore: number; // 15%
  trend: RiskTrend;
  criticalExposures: number;
}

export type RiskAppetiteStatus = 'within_appetite' | 'nearing_limit' | 'exceeding_appetite';

export interface RiskAppetiteData {
  strategicRiskStatus: RiskAppetiteStatus;
  regulatoryRiskStatus: RiskAppetiteStatus;
  financialRiskStatus: RiskAppetiteStatus;
  operationalRiskStatus: RiskAppetiteStatus;
  breachesCount: number;
  appetiteAlignmentIndex: number; // 0-100
}

export interface EnterpriseRiskOverviewData {
  activeRisksCount: number;
  criticalRisksCount: number;
  highProbabilityHighImpact: number;
  risksWithNoOwner: number;
  risksWithoutMitigation: number;
  riskExposureTrend: RiskTrend;
}

export interface ComplianceIntelligenceData {
  activeRegulatoryObligations: number;
  upcomingDeadlines30Days: number;
  activePolicies: number;
  nonConformities: number;
  criticalComplianceGaps: number;
  complianceAdherenceIndex: number; // 0-100
}

export interface ControlEffectivenessData {
  totalControls: number;
  automatedControls: number;
  failedTests30Days: number;
  recurrentFailures: number;
  controlMaturityLevel: 'Initial' | 'Defined' | 'Managed' | 'Optimized';
  controlEffectivenessIndex: number; // 0-100
}

export interface AuditIntelligenceData {
  openAuditFindings: number;
  criticalFindings: number;
  overdueActionPlans: number;
  recurrentAuditIssues: number;
  averageResolutionTimeDays: number;
}

export interface EnterpriseResilienceData {
  criticalBusinessProcesses: number;
  processesWithoutContinuityPlan: number;
  criticalSuppliersAtRisk: number;
  keyPersonDependencyCount: number;
  techSystemSinglePointOfFailures: number;
  resilienceReadinessIndex: number; // 0-100
}

export interface RiskExecutiveDataPayload<T> {
  metadata: {
    generatedAt: string;
    office: 'risk';
    capability: string;
    version: string;
  };
  healthScore?: ExecutiveRiskHealthScore;
  insights: ExecutiveInsight[];
  risks: string[];
  recommendations: string[];
  metrics: T;
}

export interface RiskExecutiveSummaryData {
  healthScore: ExecutiveRiskHealthScore;
  appetiteAlignment: RiskAppetiteData;
  criticalExposures: number;
  overdueActionPlans: number;
  complianceAdherenceIndex: number;
  criticalRisks: string[];
  criticalInsights: ExecutiveInsight[];
}
