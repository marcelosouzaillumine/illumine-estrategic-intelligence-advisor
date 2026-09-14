import { BaselineId } from '@illumine/architecture-governance-types';

export interface HistoryContract {
  baselineId: BaselineId;
  delta: number;
  improvements: number;
  regressions: number;
  comparisonWithPrevious: string;
  comparisonWithBaseline: string;
  improvementPercentage: number;
  changeSummary: string;
}
