import type {
  CapitalAllocationIntelligenceInput,
  CapitalAllocationIntelligenceReportLike,
} from './capital-allocation-intelligence-types';

export function mapReportToCapitalAllocationIntelligenceInput(
  report: CapitalAllocationIntelligenceReportLike,
): CapitalAllocationIntelligenceInput {
  return {
    sectorIntelligence: report.sectorIntelligence,
    benchmarkIntelligence: report.benchmarkIntelligence,
    valuationIntelligence: report.valuationIntelligence,
    esgIntelligence: report.esgIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
  };
}
