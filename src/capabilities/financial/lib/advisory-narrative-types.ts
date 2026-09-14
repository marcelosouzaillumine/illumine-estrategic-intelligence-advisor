import type { ExecutiveFinancialStory } from './executive-financial-story-types';

export interface AdvisoryNarrativeInput {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface AdvisoryNarrativeReportLike {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface AdvisoryNarrative {
  advisoryExecutiveSummary: string;
  strategicOpportunities: string[];
  advisoryHypotheses: string[];
  advisoryRecommendations: string[];
  executiveReflectionQuestions: string[];
  systemicObservations: string[];
  fiduciaryDisclaimer: string;
}
