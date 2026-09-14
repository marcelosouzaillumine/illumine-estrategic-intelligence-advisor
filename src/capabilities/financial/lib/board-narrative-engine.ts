import type { BoardNarrativeInput, BoardNarrative } from './board-narrative-types';

export function buildBoardNarrative(input: BoardNarrativeInput | undefined): BoardNarrative | undefined {
  if (!input?.executiveFinancialStory) return undefined;
  
  const { executiveFinancialStory } = input;
  
  return {
    boardBriefing: executiveFinancialStory.executiveBriefing,
    boardMessage: executiveFinancialStory.boardMessage,
    executiveAgenda: executiveFinancialStory.recommendedDiscussionAgenda,
    fiduciaryQuestions: executiveFinancialStory.decisionQuestions,
    decisionPoints: executiveFinancialStory.fiduciaryAttentionPoints,
    riskOversightAgenda: executiveFinancialStory.fiduciaryAttentionPoints,
    recommendedBoardActions: executiveFinancialStory.recommendedDiscussionAgenda,
    fiduciaryDisclaimer: executiveFinancialStory.fiduciaryDisclaimer
  };
}
