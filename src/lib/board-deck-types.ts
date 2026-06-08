import type { BoardPack } from './board-pack-types';

export interface BoardDeckInput {
  boardPack?: BoardPack;
}

export interface BoardDeckReportLike {
  boardPack?: BoardPack;
}

export interface BoardDeckSlide {
  title: string;
  subtitle?: string;
  content: string[];
}

export interface BoardDeck {
  coverSlide: BoardDeckSlide;
  executiveSummarySlide: BoardDeckSlide;
  agendaSlide: BoardDeckSlide;
  fiduciaryQuestionsSlide: BoardDeckSlide;
  decisionPointsSlide: BoardDeckSlide;
  strategicRisksSlide: BoardDeckSlide;
  recommendedActionsSlide: BoardDeckSlide;
  stakeholderPerspectivesSlide: BoardDeckSlide;
  closingSlide: BoardDeckSlide;
  fiduciaryDisclaimer: string;
}
