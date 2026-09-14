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
  type: 'evidence' | 'governance' | 'rule' | 'override';
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
  supportingPrinciples?: string[];
  principleCategories?: string[];
  executiveRationale?: string;
  benchmarkImpact?: number;
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
  relatedPrinciples?: string[];
  governanceRationale?: string;
  benchmarkAlignment?: string;
  benchmarkTierImpact?: string;
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
  geiSimpleScore: number;
  geiWeightedScore: number;
  gaiScore: number;
  overdueRate: number;
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
  executionStatus?: string;
  principlesApplied?: string[];
  benchmarkReadinessStatus?: "CERTIFIED" | "CONDITIONALLY_CERTIFIED" | "NOT_CERTIFIED";
  benchmarkReadinessScore?: number;
  benchmarkPosition?: string;
  bpsScore?: number;
  apsScore?: number;
  advisoryConfidenceScore?: number;
  learningResult?: GovernanceLearningResult;
  journeyOverview?: GovernanceJourneyResult;
}

export type BoardPackSlideTemplate = "STANDARD_BOARD" | "FAMILY_BUSINESS" | "BAM" | "INVESTOR";

export type SlideMeetingCriticality = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface BoardPackSlide {
  slideNumber: number;
  title: string;
  objective: string;
  content: string[];
  visualType: "SUMMARY" | "SCORECARD" | "RISK_MATRIX" | "ROADMAP" | "TREND" | "DECISION";
  meetingCriticality: SlideMeetingCriticality;
}

export interface RecommendedDecisionEntry {
  decision: string;
  urgency: string;
  expectedBenefit: string;
}

export interface BoardPack {
  packId: string;
  generatedAt: string;
  title: string;
  executiveHeadline: string;
  slideTemplate: BoardPackSlideTemplate;
  decisionReadinessScore: number;
  slides: BoardPackSlide[];
  recommendedDecisionRegister: RecommendedDecisionEntry[];
  lineageHash: string;
  scenario: ESGIMScenario;
  timelineMode: "LIVE_HISTORY" | "DEMO_TIMELINE";
  geiScore?: number;
}

export type GovernanceDecisionType = 
  | "BOARD_RESOLUTION" 
  | "MANAGEMENT_ACTION" 
  | "CORRECTIVE_ACTION" 
  | "STRATEGIC_INITIATIVE";

export type CognitiveOriginEngine = "ESGIM" | "IRI" | "BPE" | "GRE" | "GML" | "BOARD";

export type DecisionExecutionRisk = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface GovernanceDecision {
  id: string;
  title: string;
  description: string;
  source: "BPE" | "GRE" | "BOARD";
  category: "FIDUCIARY" | "GOVERNANCE" | "MISSION" | "INSTITUTIONAL" | "STRATEGIC";
  decisionType: GovernanceDecisionType;
  originEngine: CognitiveOriginEngine;
  executionRisk: DecisionExecutionRisk;
  assignedTo?: string;
  createdAt: string;
  dueDate?: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "CANCELLED";
  expectedBenefit: string;
  evidence: string[];
  lineageHash: string;
  approvedByBoard: boolean;
  approvedAt?: string;
  relatedDecisionIds?: string[];
  meetingId?: string;
  principleMatches?: PrincipleMatch[];
}

export interface MeetingAgendaItem {
  id: string;
  title: string;
  category: "RISK" | "PRIORITY" | "ROADMAP" | "EXECUTION" | "MISSION";
  criticality: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  recommendedDiscussion: string;
}

export interface BoardResolution {
  id: string;
  title: string;
  description: string;
  decision: "APPROVED" | "REJECTED" | "POSTPONED";
  approvedAt?: string;
  linkedDecisionIds: string[];
  decidedBy?: string;
  decisionReason?: string;
}

export interface BoardMeeting {
  meetingId: string;
  title: string;
  createdAt: string;
  scenario: ESGIMScenario;
  readinessScore: number;
  agendaItems: MeetingAgendaItem[];
  resolutions: BoardResolution[];
  status: "PREPARING" | "ACTIVE" | "COMPLETED";
}

export interface MeetingMinutes {
  meetingId: string;
  generatedAt: string;
  participants: string[];
  discussedTopics: string[];
  approvedResolutions: string[];
  rejectedResolutions: string[];
  postponedResolutions: string[];
  actionItems: string[];
  executiveSummary: string;
  status: "DRAFT" | "APPROVED";
}

export interface PrincipleMatch {
  principleId: string;
  title: string;
  category:
    | "GOVERNANCE"
    | "LEADERSHIP"
    | "STRATEGIC"
    | "ETHICAL"
    | "ESG"
    | "INSTITUTIONAL"
    | "BAM"
    | "BIBLICAL";
  explanation: string;
  relevanceScore: number;
}

export interface GovernanceKnowledgeResult {
  sourceId: string;
  sourceType:
    | "ESGIM"
    | "IRI"
    | "BPE"
    | "GRE"
    | "GDTL"
    | "BMM";
  principleMatches: PrincipleMatch[];
  executiveRationale: string;
  lineageHash: string;
}

export type BenchmarkReadinessLevel =
  | "EXCELLENT"
  | "MATURE"
  | "DEVELOPING"
  | "CONCERN"
  | "CRITICAL";

export interface BenchmarkReadinessResult {
  score: number;
  level: BenchmarkReadinessLevel;
  benchmarkEligible: boolean;
  dataReadiness: number;
  dataReadinessStatus: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  governanceReadiness: number;
  governanceReadinessStatus: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  institutionalReadiness: number;
  institutionalReadinessStatus: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  comparativeReadiness: number;
  comparativeReadinessStatus: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  strengths: string[];
  vulnerabilities: string[];
  executiveSummary: string;
  certificationStatus:
    | "CERTIFIED"
    | "CONDITIONALLY_CERTIFIED"
    | "NOT_CERTIFIED";
  explainability: string[];
  lineageHash: string;
  createdAt: string;
  benchmarkBlockedReason?: string;
  requiredBeforeBenchmark?: string[];
}

export type BenchmarkPosition =
  | "TOP_10"
  | "TOP_25"
  | "TOP_50"
  | "BOTTOM_50"
  | "BOTTOM_25";

export interface BenchmarkGap {
  metric: string;
  currentScore: number;
  targetScore: number;
  gap: number;
}

export interface ComparativeDimension {
  dimension: string;
  currentScore: number;
  benchmarkScore: number;
  delta: number;
  position: BenchmarkPosition;
}

export interface BenchmarkComparativeResult {
  bpsScore: number;
  benchmarkPosition: BenchmarkPosition;
  benchmarkEligible: boolean;
  cohortId: string;
  cohortName: string;
  cohortDataMode: "SYNTHETIC_COHORT" | "INTERNAL_ANONYMIZED" | "EXTERNAL_VERIFIED";
  comparativeDimensions: ComparativeDimension[];
  strengths: string[];
  vulnerabilities: string[];
  benchmarkGaps: BenchmarkGap[];
  executiveSummary: string;
  recommendations: string[];
  lineageHash: string;
  benchmarkLimitations: string[];
  advisoryWarnings: string[];
}

export type BenchmarkTargetTier =
  | "TOP_10"
  | "TOP_25"
  | "TOP_50";

export interface AdvisoryInitiative {
  id: string;
  title: string;
  category:
    | "FIDUCIARY"
    | "GOVERNANCE"
    | "MISSION"
    | "INSTITUTIONAL"
    | "EXECUTION";
  currentScore: number;
  targetScore: number;
  expectedImpact: number;
  difficulty:
    | "LOW"
    | "MODERATE"
    | "HIGH";
  horizon:
    | "SHORT_TERM"
    | "MEDIUM_TERM"
    | "LONG_TERM";
  rationale: string;
  initiativeType:
    | "QUICK_WIN"
    | "FOUNDATIONAL"
    | "TRANSFORMATIONAL";
  simulatedBpsImpact: number;
  simulatedTargetPosition: BenchmarkPosition;
}

export interface BenchmarkAdvancementGap {
  metric: string;
  currentValue: number;
  nextTierTarget: number;
  leaderTarget: number;
  improvementRequired: number;
}

export interface BenchmarkAdvisoryResult {
  apsScore: number;
  currentPosition: BenchmarkPosition;
  targetPosition: BenchmarkTargetTier;
  benchmarkReady: boolean;
  advancementGaps: BenchmarkAdvancementGap[];
  initiatives: AdvisoryInitiative[];
  executiveSummary: string;
  expectedAdvancementImpact: string;
  strengthsToProtect: string[];
  weaknessesToImprove: string[];
  roadmapRecommendations: string[];
  lineageHash: string;
  advisoryConfidenceScore: number;
  confidenceDrivers: string[];
  confidenceWarnings: string[];
  advisoryLimitations: string[];
}

export interface LearningObservation {
  id: string;
  title: string;
  source:
    | "BPE"
    | "GRE"
    | "GDTL"
    | "BOARD"
    | "BAI";
  expectedOutcome: string;
  actualOutcome: string;
  effectivenessScore: number;
  status:
    | "EXCEEDED"
    | "ACHIEVED"
    | "PARTIALLY_ACHIEVED"
    | "FAILED";
  lessonsLearned: string[];
  recommendations: string[];
  variance?: number;
  expectedImpact?: number;
  actualImpact?: number;
}

export interface GovernanceLearningResult {
  gliScore: number;
  learningMaturity:
    | "HIGH"
    | "MODERATE"
    | "LOW"
    | "CRITICAL";
  observations: LearningObservation[];
  institutionalStrengths: string[];
  recurringFailures: string[];
  executiveSummary: string;
  lineageHash: string;
  aaiScore: number;
  aaiLevel:
    | "HIGHLY_ACCURATE"
    | "RELIABLE"
    | "NEEDS_CALIBRATION"
    | "WEAK_PREDICTIVE_ACCURACY";
  feedbackMode: "LIVE_OUTCOME" | "SIMULATED_FEEDBACK";
}

export interface GovernanceJourneyStep {
  id: string;
  title: string;
  description: string;
  status: "HEALTHY" | "ATTENTION" | "CRITICAL";
  primaryMetric: string;
  primaryValue: string;
  executiveSummary: string;
  sourceModules: string[];
  actionRequired?: string;
  executiveAttentionScore: number;
}

export interface GovernanceJourneyResult {
  overallStatus: "HEALTHY" | "ATTENTION" | "CRITICAL";
  currentJourneyStage: string;
  executiveNarrative: string;
  steps: GovernanceJourneyStep[];
  lineageHash: string;
  gjiScore: number;
  gjiStage: string;
  boardNarrative: string;
}




