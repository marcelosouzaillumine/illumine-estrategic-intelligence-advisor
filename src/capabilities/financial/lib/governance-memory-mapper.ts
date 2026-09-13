import type {
  GovernanceMemoryInput,
  GovernanceMemoryReportLike,
} from "./governance-memory-types";

export function mapReportToGovernanceMemoryInput(
  report: GovernanceMemoryReportLike,
): GovernanceMemoryInput {
  return {
    boardNarrative: report.boardNarrative,
    advisoryNarrative: report.advisoryNarrative,
    partnerNarrative: report.partnerNarrative,
    managementNarrative: report.managementNarrative,
    governanceCommunicationFramework: report.governanceCommunicationFramework,
    institutionalReportPackage: report.institutionalReportPackage,
  };
}
