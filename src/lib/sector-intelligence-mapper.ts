import type {
  SectorIntelligenceInput,
  SectorIntelligenceReportLike,
} from './sector-intelligence-types';

export function mapReportToSectorIntelligenceInput(
  report: SectorIntelligenceReportLike,
): SectorIntelligenceInput {
  return {
    esgIntelligence: report.esgIntelligence,
    valuationIntelligence: report.valuationIntelligence,
    benchmarkIntelligence: report.benchmarkIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
  };
}
