import type { ExecutiveFinancialStory } from './executive-financial-story-types';

export interface BoardNarrativeInput {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface BoardNarrativeReportLike {
  executiveFinancialStory?: ExecutiveFinancialStory;
}

export interface BoardNarrative {
  boardBriefing: string;
  boardMessage: string;
  executiveAgenda: string[];
  fiduciaryQuestions: string[];
  decisionPoints: string[];
  riskOversightAgenda: string[];
  recommendedBoardActions: string[];
  fiduciaryDisclaimer: string;
}
