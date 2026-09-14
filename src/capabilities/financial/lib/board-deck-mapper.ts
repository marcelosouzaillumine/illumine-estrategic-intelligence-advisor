import type {
  BoardDeckInput,
  BoardDeckReportLike,
} from './board-deck-types';

export function mapReportToBoardDeckInput(
  report: BoardDeckReportLike,
): BoardDeckInput {
  return {
    boardPack: report.boardPack,
  };
}
