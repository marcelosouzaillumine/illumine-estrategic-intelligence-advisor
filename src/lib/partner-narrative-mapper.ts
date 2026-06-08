import type { PartnerNarrativeInput, PartnerNarrativeReportLike } from './partner-narrative-types';

export function mapReportToPartnerNarrativeInput(
  report: PartnerNarrativeReportLike
): PartnerNarrativeInput {
  return {
    executiveFinancialStory: report.executiveFinancialStory,
  };
}
