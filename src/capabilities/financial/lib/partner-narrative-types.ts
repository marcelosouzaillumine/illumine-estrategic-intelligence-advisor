import type { ExecutiveFinancialStory } from './executive-financial-story-types';

export interface PartnerNarrativeInput {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface PartnerNarrativeReportLike {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface PartnerNarrative {
  shareholderMessage: string;
  valueCreationNarrative: string;
  capitalPreservationNarrative: string;
  patrimonialGrowthNarrative: string;
  longTermSustainabilityNarrative: string;
  distributionPerspective: string;
  partnerReflectionQuestions: string[];
  strategicOwnershipAgenda: string[];
  fiduciaryDisclaimer: string;
}
