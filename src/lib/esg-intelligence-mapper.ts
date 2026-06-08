import type {
  ESGIntelligenceInput,
  ESGIntelligenceReportLike,
} from "./esg-intelligence-types";

export function mapReportToESGIntelligenceInput(
  report: ESGIntelligenceReportLike,
): ESGIntelligenceInput {
  return {
    governanceMemory: report.governanceMemory,
    governanceIntelligence: report.governanceIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
  };
}
