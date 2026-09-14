import type { BoardNarrativeReportLike, BoardNarrativeInput } from './board-narrative-types';

export function mapReportToBoardNarrativeInput(
  report: BoardNarrativeReportLike
): BoardNarrativeInput {
  return {
    executiveFinancialStory: report.executiveFinancialStory,
  };
}
