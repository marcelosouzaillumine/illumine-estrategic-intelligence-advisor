import type { ManagementNarrative, ManagementNarrativeInput } from './management-narrative-types';

const FIDUCIARY_DISCLAIMER = 'Esta narrativa gerencial deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.';

export function buildManagementNarrative(
  input: ManagementNarrativeInput | undefined
): ManagementNarrative | undefined {
  if (!input?.executiveFinancialStory) {
    return undefined;
  }
  
  const story = input.executiveFinancialStory;
  
  return {
    managementBriefing: story.managementMessage,
    executionPriorities: story.fiduciaryAttentionPoints,
    managementActionPlan: story.recommendedDiscussionAgenda,
    accountabilityAgenda: story.decisionQuestions,
    operationalAttentionPoints: story.fiduciaryAttentionPoints,
    leadershipAlignmentAgenda: story.recommendedDiscussionAgenda,
    performanceMonitoringAgenda: story.decisionQuestions,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
