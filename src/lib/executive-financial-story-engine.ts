// src/lib/executive-financial-story-engine.ts
import type { ExecutiveFinancialStory, ExecutiveFinancialStoryInput } from './executive-financial-story-types';
import type { NarrativeContext } from './narrative-context-types';
import type { UnifiedFinancialNarrative } from './unified-financial-narrative-types';

/**
 * Builds the executive financial story from the provided input.
 * Returns undefined when required data is missing.
 */
export function buildExecutiveFinancialStory(
  input: ExecutiveFinancialStoryInput | undefined
): ExecutiveFinancialStory | undefined {
  if (!input?.narrativeContext) {
    return undefined;
  }
  if (!input?.unifiedFinancialNarrative) {
    return undefined;
  }

  const { narrativeContext, unifiedFinancialNarrative } = input;

  // Helper to join arrays safely
  const join = (arr: string[] | undefined) => (arr && arr.length > 0 ? arr.join(' ') : '');

  // Build briefings and messages using the available narrative fragments
  const executiveBriefing = `Resumo executivo: ${join(unifiedFinancialNarrative.keyStrengths)}. ${join(unifiedFinancialNarrative.keyRisks)}.`;
  const boardMessage = `Para o Conselho: ${join(unifiedFinancialNarrative.keyStrengths)}. Riscos principais: ${join(unifiedFinancialNarrative.keyRisks)}.`;
  const partnerMessage = `Para os Parceiros: ${join(unifiedFinancialNarrative.keyStrengths)}. Pontos de atenção: ${join(unifiedFinancialNarrative.executiveAttentionPoints)}.`;
  const managementMessage = `Para a Gestão: ${join(unifiedFinancialNarrative.keyStrengths)}. Riscos identificados: ${join(unifiedFinancialNarrative.keyRisks)}.`;
  const advisoryMessage = `Recomendações gerais baseadas nos pontos de atenção: ${join(unifiedFinancialNarrative.executiveAttentionPoints)}.`;

  const decisionQuestions: string[] = [];
  const fiduciaryAttentionPoints = unifiedFinancialNarrative.executiveAttentionPoints || [];
  const recommendedDiscussionAgenda = [];

  const fiduciaryDisclaimer = unifiedFinancialNarrative.fiduciaryDisclaimer;

  return {
    executiveBriefing,
    boardMessage,
    partnerMessage,
    managementMessage,
    advisoryMessage,
    decisionQuestions,
    fiduciaryAttentionPoints,
    recommendedDiscussionAgenda,
    fiduciaryDisclaimer: fiduciaryDisclaimer,
  };
}
