import type {
  BoardPackInput,
  BoardPackReportLike,
} from './board-pack-types';

export function mapReportToBoardPackInput(
  report: BoardPackReportLike,
): BoardPackInput {
  return {
    unifiedFinancialNarrative: report.unifiedFinancialNarrative,
    boardNarrative: report.boardNarrative,
    advisoryNarrative: report.advisoryNarrative,
    partnerNarrative: report.partnerNarrative,
    managementNarrative: report.managementNarrative,
    governanceCommunicationFramework: report.governanceCommunicationFramework,
  };
}
