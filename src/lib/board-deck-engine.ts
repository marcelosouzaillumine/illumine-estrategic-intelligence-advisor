import type { BoardDeck, BoardDeckInput } from './board-deck-types';

export function buildBoardDeck(
  input: BoardDeckInput | undefined,
): BoardDeck | undefined {
  if (!input?.boardPack) {
    return undefined;
  }
  
  const pack = input.boardPack;
  
  return {
    coverSlide: {
      title: 'Board Meeting',
      subtitle: 'Illumine Governance™',
      content: [pack.executiveCover],
    },
    executiveSummarySlide: {
      title: 'Executive Summary',
      content: [pack.institutionalSummary],
    },
    agendaSlide: {
      title: 'Executive Agenda',
      content: pack.executiveAgenda,
    },
    fiduciaryQuestionsSlide: {
      title: 'Fiduciary Questions',
      content: pack.fiduciaryQuestions,
    },
    decisionPointsSlide: {
      title: 'Decision Points',
      content: pack.decisionPoints,
    },
    strategicRisksSlide: {
      title: 'Strategic Risks',
      content: pack.strategicRisks,
    },
    recommendedActionsSlide: {
      title: 'Recommended Actions',
      content: pack.recommendedActions,
    },
    stakeholderPerspectivesSlide: {
      title: 'Stakeholder Perspectives',
      content: [
        pack.boardMessage,
        pack.advisoryPerspective,
        pack.partnerPerspective,
        pack.managementPerspective
      ].filter((msg): msg is string => Boolean(msg)),
    },
    closingSlide: {
      title: 'Próximos Passos',
      content: [pack.governanceCommunicationSummary],
    },
    fiduciaryDisclaimer: pack.fiduciaryDisclaimer,
  };
}
