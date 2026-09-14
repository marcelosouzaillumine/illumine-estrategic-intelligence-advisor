import { HistoryContract } from '@illumine/architecture-governance-contracts';
import { BaselineId } from '@illumine/architecture-governance-types';

export class HistoryEntity implements HistoryContract {
  constructor(
    public readonly baselineId: BaselineId,
    public readonly delta: number,
    public readonly improvements: number,
    public readonly regressions: number,
    public readonly comparisonWithPrevious: string,
    public readonly comparisonWithBaseline: string,
    public readonly improvementPercentage: number,
    public readonly changeSummary: string
  ) {}
}
