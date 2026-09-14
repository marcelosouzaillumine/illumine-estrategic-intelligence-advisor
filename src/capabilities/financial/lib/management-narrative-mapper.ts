import type { ManagementNarrativeInput, ManagementNarrativeReportLike } from './management-narrative-types';

export function mapReportToManagementNarrativeInput(
  report: ManagementNarrativeReportLike
): ManagementNarrativeInput {
  return {
    executiveFinancialStory: report.executiveFinancialStory,
  };
}
