// src/lib/executive-financial-story-types.ts

import type { NarrativeContext } from './narrative-context-types';
import type { UnifiedFinancialNarrative } from './unified-financial-narrative-types';

/** Input container for the EFSL engine */
export interface ExecutiveFinancialStoryInput {
  narrativeContext?: NarrativeContext;
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
}

/** Report‑like object received from UFNE (or a subset) */
export interface ExecutiveFinancialStoryReportLike {
  narrativeContext?: NarrativeContext;
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
}

/** Final executive storytelling object */
export interface ExecutiveFinancialStory {
  executiveBriefing: string;
  boardMessage: string;
  partnerMessage: string;
  managementMessage: string;
  advisoryMessage: string;
  decisionQuestions: string[];
  fiduciaryAttentionPoints: string[];
  recommendedDiscussionAgenda: string[];
  fiduciaryDisclaimer: string; // fixed disclaimer
}
