import type { ExecutiveFinancialStory } from './executive-financial-story-types';

export interface ManagementNarrativeInput {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface ManagementNarrativeReportLike {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface ManagementNarrative {
  managementBriefing: string;
  executionPriorities: string[];
  managementActionPlan: string[];
  accountabilityAgenda: string[];
  operationalAttentionPoints: string[];
  leadershipAlignmentAgenda: string[];
  performanceMonitoringAgenda: string[];
  fiduciaryDisclaimer: string;
}
