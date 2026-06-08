import type {
  ValuationIntelligenceInput,
  ValuationIntelligenceReportLike,
} from "./valuation-intelligence-types";

export function mapReportToValuationIntelligenceInput(
  report: ValuationIntelligenceReportLike,
): ValuationIntelligenceInput {
  return {
    unifiedFinancialNarrative: report.unifiedFinancialNarrative,
    executiveFinancialStory: report.executiveFinancialStory,
    governanceIntelligence: report.governanceIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
    esgIntelligence: report.esgIntelligence,
    governanceMemory: report.governanceMemory,
  };
}
