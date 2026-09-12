// src/core/runtime/pilot-operations/types.ts

export type PilotTenantStatus =
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'DEGRADED'
  | 'SUPERVISION_REQUIRED'
  | 'FAIL_CLOSED'
  | 'ARCHIVED';

export type PilotOperationalHealth =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'PARTIAL'
  | 'FAIL_CLOSED';

export type PilotExecutiveEngagement =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL_DEPENDENCY';

export type PilotValidationCategory =
  | 'EXECUTIVE_CLARITY'
  | 'GOVERNANCE_READABILITY'
  | 'SUPERVISION_FLOW'
  | 'RUNTIME_STABILITY'
  | 'COGNITIVE_LOAD'
  | 'INCIDENT_RESPONSE'
  | 'MULTI_ENTITY_VISIBILITY'
  | 'BOARD_READINESS';

export type PilotFeedbackSeverity =
  | 'SUGGESTION'
  | 'ATTENTION'
  | 'BLOCKING'
  | 'CRITICAL';

export interface PilotFeedbackEntry {
  feedbackId: string;
  tenantId: string;
  category: PilotValidationCategory;
  severity: PilotFeedbackSeverity;
  comment: string;
  submittedBy: string;
  submittedAt: string;
  lineageHash: string;
}

export interface PilotTelemetryEvent {
  eventId: string;
  tenantId: string;
  actorId: string;
  actionType: string;
  timestamp: string;
  durationMs?: number;
  hasError?: boolean;
}

export interface CognitiveLoadSignals {
  overloadsCount: number;
  interactionVelocity: number;
  status: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface PilotOnboardingState {
  currentStepIndex: number;
  completedSteps: string[];
  lastCompletedAt?: string;
}

export interface PilotReadinessReport {
  rating: 'GO_LIVE_READY' | 'CONDITIONAL_APPROVAL' | 'UNREADY';
  maturityScore: number;
  unresolvedGovernanceBlockers: string[];
  operationalRiskSummary: string;
  recommendedProductionTimeline: string;
  generatedAt: string;
  lineageHash: string;
}

export interface PilotSupervisionTelemetry {
  tenantId: string;
  status: PilotTenantStatus;
  health: PilotOperationalHealth;
  engagement: PilotExecutiveEngagement;
  onboardingProgress: number; // 0 to 100
  runtimeStability: number; // 0 to 100
  governanceReadability: number; // 0 to 100
  supervisionClarity: number; // 0 to 100
  cognitiveLoad: CognitiveLoadSignals;
  activeFeedbackCount: number;
}
