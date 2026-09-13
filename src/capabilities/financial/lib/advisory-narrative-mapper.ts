import type { AdvisoryNarrativeInput, AdvisoryNarrativeReportLike } from './advisory-narrative-types';

export function mapReportToAdvisoryNarrativeInput(
  report: AdvisoryNarrativeReportLike
): AdvisoryNarrativeInput {
  return {
    executiveFinancialStory: report.executiveFinancialStory,
  };
}
