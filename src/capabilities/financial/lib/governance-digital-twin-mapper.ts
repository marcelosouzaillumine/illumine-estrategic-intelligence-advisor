import type {
  GovernanceDigitalTwinInput,
  GovernanceDigitalTwinReportLike,
} from "./governance-digital-twin-types";

export function mapReportToGovernanceDigitalTwinInput(
  report: GovernanceDigitalTwinReportLike,
): GovernanceDigitalTwinInput {
  return {
    governanceMemory: report.governanceMemory,
    governanceIntelligence: report.governanceIntelligence,
  };
}
