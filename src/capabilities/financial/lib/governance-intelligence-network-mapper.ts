import type {
  GovernanceIntelligenceInput,
  GovernanceIntelligenceReportLike,
} from "./governance-intelligence-network-types";

export function mapReportToGovernanceIntelligenceInput(
  report: GovernanceIntelligenceReportLike,
): GovernanceIntelligenceInput {
  return {
    governanceMemory: report.governanceMemory,
  };
}
