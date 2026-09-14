import type { BoardPack, BoardPackInput } from './board-pack-types';

const FIDUCIARY_DISCLAIMER =
  'Este Board Pack consolida informações produzidas pelas camadas narrativas institucionais da Illumine Governance™. Nenhum indicador, score, classificação ou resultado fiduciário foi recalculado ou alterado durante sua geração.';

export function buildBoardPack(
  input: BoardPackInput | undefined,
): BoardPack | undefined {
  if (!input?.governanceCommunicationFramework) {
    return undefined;
  }
  
  const gcf = input.governanceCommunicationFramework;
  const board = input.boardNarrative;
  const ufne = input.unifiedFinancialNarrative;
  const advisory = input.advisoryNarrative;
  const partner = input.partnerNarrative;
  const management = input.managementNarrative;
  
  const institutionalSummary = [
    ufne?.valueCreationSummary,
    ufne?.liquidityAndCashSummary,
    ufne?.patrimonialHealthSummary,
    ufne?.capitalAllocationSummary
  ].filter(Boolean).join('\n\n');

  const governanceCommunicationSummary = [
    ...(gcf.integratedExecutiveAgenda ?? []),
    ...(gcf.integratedDecisionAgenda ?? []),
    ...(gcf.integratedAttentionPoints ?? [])
  ].join('\n');

  return {
    executiveCover: 'Este Board Pack consolida os principais temas fiduciários, estratégicos e institucionais identificados pela plataforma Illumine Governance™.',
    institutionalSummary: institutionalSummary || '',
    executiveAgenda: board?.executiveAgenda ?? [],
    fiduciaryQuestions: board?.fiduciaryQuestions ?? [],
    decisionPoints: board?.decisionPoints ?? [],
    strategicRisks: [
      ...(board?.fiduciaryQuestions ?? []),
      ...(board?.decisionPoints ?? []),
      ...(board?.riskOversightAgenda ?? [])
    ],
    recommendedActions: board?.recommendedBoardActions ?? [],
    boardMessage: board?.boardMessage ?? '',
    advisoryPerspective: advisory?.advisoryExecutiveSummary,
    partnerPerspective: partner?.shareholderMessage,
    managementPerspective: management?.managementBriefing,
    governanceCommunicationSummary: governanceCommunicationSummary,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
