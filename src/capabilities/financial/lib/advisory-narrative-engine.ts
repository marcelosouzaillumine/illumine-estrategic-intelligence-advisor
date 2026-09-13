import type { AdvisoryNarrative, AdvisoryNarrativeInput } from './advisory-narrative-types';

const FIDUCIARY_DISCLAIMER = 'Esta narrativa consultiva deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.';

export function buildAdvisoryNarrative(
  input: AdvisoryNarrativeInput | undefined
): AdvisoryNarrative | undefined {
  if (!input?.executiveFinancialStory) {
    return undefined;
  }
  
  const story = input.executiveFinancialStory;
  
  return {
    advisoryExecutiveSummary: story.executiveBriefing,
    strategicOpportunities: story.recommendedDiscussionAgenda,
    advisoryHypotheses: story.fiduciaryAttentionPoints,
    advisoryRecommendations: story.recommendedDiscussionAgenda,
    executiveReflectionQuestions: story.decisionQuestions,
    systemicObservations: story.fiduciaryAttentionPoints,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
