import type {
  BenchmarkIntelligenceInput,
  BenchmarkIntelligenceReportLike,
} from "./benchmark-intelligence-types";

export function mapReportToBenchmarkIntelligenceInput(
  report: BenchmarkIntelligenceReportLike,
): BenchmarkIntelligenceInput {
  return {
    governanceMemory: report.governanceMemory,
    governanceIntelligence: report.governanceIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
    esgIntelligence: report.esgIntelligence,
    valuationIntelligence: report.valuationIntelligence,
    unifiedFinancialNarrative: report.unifiedFinancialNarrative,
  };
}
