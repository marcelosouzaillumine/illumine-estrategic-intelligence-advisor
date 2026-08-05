import { ExecutiveInsight } from './executive-insight.types';

export interface ExecutiveGovernanceHealthScore {
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  components: {
    strategicAlignment: number; // 25%
    decisionEffectiveness: number; // 20%
    accountability: number; // 20%
    executionGovernance: number; // 20%
    transparency: number; // 15%
  };
}

export type DecisionLifecycleState = 'Identified' | 'Analyzed' | 'Approved' | 'Executing' | 'Measured' | 'Closed';

export interface GovernanceActionFramework {
  actionId: string;
  decisionId: string;
  description: string;
  ownerId: string;
  ownerName: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  followUpDate?: string;
}

export interface GovernanceExecutiveDataPayload<T> {
  metadata: {
    generatedAt: string;
    office: 'governance';
    capability: string;
    version: string;
  };
  healthScore?: ExecutiveGovernanceHealthScore;
  insights: ExecutiveInsight[];
  risks: string[];
  recommendations: string[];
  metrics: T;
}

export interface StrategicAlignmentData {
  strategicObjectivesCount: number;
  okrsOnTrackPercentage: number;
  criticalGoalsAtRisk: number;
  strategyExecutionIndex: number; // 0-100
  alignmentScore: number;
}

export interface DecisionGovernanceData {
  openDecisions: number;
  approvedDecisions: number;
  delayedDecisions: number; // Critical for tracking bottlenecks
  averageDecisionTimeDays: number;
  decisionsByLifecycle: Record<DecisionLifecycleState, number>;
  criticalDecisionsWithoutAction: number;
}

export interface BoardIntelligenceData {
  upcomingBoardMeetings: number;
  criticalTopicsPending: number;
  pendingBoardResolutions: number;
  boardPackReadinessIndex: number; // 0-100
  executiveCommitmentsAtRisk: number;
}

export interface GovernanceMaturityData {
  processMaturityLevel: 'Initial' | 'Defined' | 'Managed' | 'Optimized' | 'Intelligent';
  activeForumsCount: number;
  managementCadenceAdherence: number; // 0-100
  auditFindingsOpen: number;
  transparencyIndex: number;
}

// Executive Summary for the Overview
export interface GovernanceExecutiveSummaryData {
  healthScore: number;
  strategyExecutionIndex: number;
  delayedDecisions: number;
  managementCadenceAdherence: number;
  criticalRisks: string[];
  criticalInsights: ExecutiveInsight[];
}
