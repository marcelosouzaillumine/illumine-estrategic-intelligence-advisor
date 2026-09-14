import type {
  GovernanceCommunicationFrameworkInput,
  GovernanceCommunicationFrameworkReportLike,
} from './governance-communication-framework-types';

export function mapReportToGovernanceCommunicationFrameworkInput(
  report: GovernanceCommunicationFrameworkReportLike,
): GovernanceCommunicationFrameworkInput {
  return {
    boardNarrative: report.boardNarrative,
    advisoryNarrative: report.advisoryNarrative,
    partnerNarrative: report.partnerNarrative,
    managementNarrative: report.managementNarrative,
  };
}
