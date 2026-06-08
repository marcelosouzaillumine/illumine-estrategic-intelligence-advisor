import type {
  InstitutionalReportingInput,
  InstitutionalReportingReportLike,
} from "./institutional-reporting-types";

export function mapReportToInstitutionalReportingInput(
  report: InstitutionalReportingReportLike,
): InstitutionalReportingInput {
  return {
    boardPack: report.boardPack,
    boardDeck: report.boardDeck,
  };
}
