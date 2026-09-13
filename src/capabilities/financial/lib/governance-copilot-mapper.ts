// src/lib/governance-copilot-mapper.ts

import type { GovernanceCopilotReportLike, GovernanceCopilotContextInput } from './governance-copilot-types';

export function mapReportToGovernanceCopilotContextInput(
  report: GovernanceCopilotReportLike
): GovernanceCopilotContextInput {
  if (!report) {
    return {};
  }

  // Extract relevant contextual blocks strictly read-only
  return {
    governanceMemory: report.governanceMemory,
    governanceIntelligenceNetwork: report.governanceIntelligence,
    governanceDigitalTwin: report.governanceDigitalTwin,
    esgIntelligence: report.esgIntelligence,
    valuationIntelligence: report.valuationIntelligence,
    benchmarkIntelligence: report.benchmarkIntelligence,
    sectorIntelligence: report.sectorIntelligence,
    capitalAllocationIntelligence: report.capitalAllocationIntelligence,
    executiveSovereignty: report.executiveSovereignty,
    institutionalOutcomes: report.institutionalOutcomes
  };
}
