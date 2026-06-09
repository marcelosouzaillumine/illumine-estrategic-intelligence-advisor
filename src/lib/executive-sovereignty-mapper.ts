import type {
  ExecutiveSovereigntyInput,
  ExecutiveSovereigntyReportLike,
} from './executive-sovereignty-types';

export function mapReportToExecutiveSovereigntyInput(
  report: ExecutiveSovereigntyReportLike,
): ExecutiveSovereigntyInput {
  return {
    governanceDigitalTwin: report.governanceDigitalTwin,
    esgIntelligence: report.esgIntelligence,
    valuationIntelligence: report.valuationIntelligence,
    benchmarkIntelligence: report.benchmarkIntelligence,
    sectorIntelligence: report.sectorIntelligence,
    capitalAllocationIntelligence: report.capitalAllocationIntelligence,
  };
}
