import type { PartnerNarrative, PartnerNarrativeInput } from './partner-narrative-types';

const FIDUCIARY_DISCLAIMER = 'Esta narrativa societária deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.';

export function buildPartnerNarrative(
  input: PartnerNarrativeInput | undefined
): PartnerNarrative | undefined {
  if (!input?.executiveFinancialStory) {
    return undefined;
  }
  
  const story = input.executiveFinancialStory;
  
  return {
    shareholderMessage: story.partnerMessage,
    valueCreationNarrative: story.executiveBriefing,
    capitalPreservationNarrative: story.boardMessage,
    patrimonialGrowthNarrative: story.managementMessage,
    longTermSustainabilityNarrative: story.advisoryMessage,
    distributionPerspective: story.partnerMessage,
    partnerReflectionQuestions: story.decisionQuestions,
    strategicOwnershipAgenda: story.recommendedDiscussionAgenda,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
