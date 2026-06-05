// src/core/runtime/esgim/esgimTypes.ts

export type ESGIMMaturityLevel = 'EXCELLENT' | 'MATURE' | 'DEVELOPING' | 'CONCERN' | 'CRITICAL';

export type ESGIMDimension = 'Environmental' | 'Social' | 'Governance' | 'Institutional' | 'Mission';

export interface ESGIMDimensionResult {
  dimension: ESGIMDimension;
  score: number;
  status: ESGIMMaturityLevel;
  explanation: string;
}

export type ESGIMMode = 'LIVE_DATA' | 'DEMO_SCENARIO';

export type ESGIMScenario = 
  | 'STANDARD' 
  | 'CONSTITUTIONAL_BREACH' 
  | 'FOUNDER_EXIT' 
  | 'LIQUIDITY_SHOCK' 
  | 'MARKET_DISRUPTION' 
  | 'MISSION_STRESS';

export interface ESGIMAssessment {
  overallScore: number;
  maturityLevel: ESGIMMaturityLevel;
  dimensions: ESGIMDimensionResult[];
  strengths: string[];
  vulnerabilities: string[];
  executiveSummary: string;
  mode: ESGIMMode;
  auditTrail: {
    auditId: string;
    timestamp: string;
    rulesApplied: string[];
    evidenceTrail: string[];
    details: string;
  };
  lineageHash: string;
  createdAt: string;
}

export type IRILevel = 'HIGH_RESILIENCE' | 'RESILIENT' | 'MODERATE' | 'FRAGILE' | 'CRITICAL';

export interface ExplainabilityTrail {
  title: string;
  type: 'evidence' | 'intelligence' | 'rule' | 'override';
  description: string;
  timestamp: string;
}

export interface InstitutionalResilienceResult {
  score: number;
  level: IRILevel;
  fiduciaryResilience: number;
  institutionalResilience: number;
  prospectiveResilience: number;
  missionContinuity: number;
  strengths: string[];
  vulnerabilities: string[];
  executiveSummary: string;
  explainability: ExplainabilityTrail[];
  lineageHash: string;
  createdAt: string;
}

export interface BoardExecutiveBrief {
  headline: string;
  summary: string;
  primaryRisk: string;
  primaryOpportunity: string;
  recommendedFocus: string;
}

export interface BoardPriority {
  id: string;
  title: string;
  description: string;
  category: "FIDUCIARY" | "INSTITUTIONAL" | "MISSION" | "GOVERNANCE" | "STRATEGIC";
  urgency: "IMMEDIATE" | "SHORT_TERM" | "MEDIUM_TERM" | "LONG_TERM";
  impact: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  expectedBenefit: string;
  evidence: string[];
  explainability: string[];
  decisionCategory: "Survival" | "Stabilization" | "Strengthening" | "Growth" | "Legacy";
  priorityScore: number;
  constitutionalDriver: "CONSTITUTIONAL" | "FIDUCIARY" | "INSTITUTIONAL" | "MISSION" | "PROSPECTIVE";
  estimatedWindow: string;
  expectedImpactArea: string[];
}

export interface GovernanceRoadmapPhase {
  phaseId: string;
  title: string;
  objective: string;
  durationMonths: number;
  priorities: string[];
  expectedBenefits: string[];
  dependencies: string[];
  riskReductionAreas: string[];
  completionCriteria: string[];
}

export interface GovernanceRoadmap {
  maturityStage: "STABILIZATION" | "STRUCTURING" | "STRENGTHENING" | "SCALING" | "LEGACY";
  executiveSummary: string;
  phases: GovernanceRoadmapPhase[];
  estimatedDurationMonths: number;
  expectedOutcomes: string[];
  explainability: string[];
  roadmapProgress: number;
  roadmapRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  nextCriticalMilestone: string;
  quickWins: string[];
  foundationalInitiatives: string[];
  strategicInitiatives: string[];
  generatedFromPriorities: string[];
}

export interface GovernanceMonitoringSnapshot {
  timestamp: string;
  esgimScore: number;
  iriScore: number;
  roadmapProgress: number;
  priorityExecutionIndex: number;
  institutionalRiskIndex: number;
}

export interface MonitoringAlert {
  title: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  description: string;
  recommendedAction: string;
}

export interface GovernanceMonitoringResult {
  trend: "IMPROVING" | "STABLE" | "DECLINING";
  snapshots: GovernanceMonitoringSnapshot[];
  executiveSummary: string;
  alerts: MonitoringAlert[];
  recommendations: string[];
  lineageHash: string;
  explainability: ExplainabilityTrail[];
  timelineMode: "LIVE_HISTORY" | "DEMO_TIMELINE";
}

export interface ExecutiveBoardReport {
  reportId: string;
  generatedAt: string;
  reportMode: "BOARD_EXECUTIVE" | "ADVISORY_DETAIL";
  scenario: ESGIMScenario;
  companyName: string;
  generatedBy?: string;
  confidenceLevel: "HIGH" | "MODERATE" | "LOW";
  executiveHeadline: string;
  executiveSummary: string;
  overallAssessment: string;
  principalRisks: string[];
  principalOpportunities: string[];
  boardPriorities: string[];
  roadmapHighlights: string[];
  monitoringHighlights: string[];
  recommendedDecisions: string[];
  explainability: string[];
  lineageHash: string;
  timelineMode: "LIVE_HISTORY" | "DEMO_TIMELINE";
}
