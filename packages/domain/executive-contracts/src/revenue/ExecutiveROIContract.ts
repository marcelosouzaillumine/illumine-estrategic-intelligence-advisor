export interface ExecutiveROIContract {
  readonly roiId: string;
  readonly companyName: string;
  readonly annualSavingsEstimated: number;
  readonly projectedMarginExpansionPercent: number;
  readonly paybackPeriodDays: number;
  readonly roiRatioMultiplier: number; // e.g. 5.5x
}
