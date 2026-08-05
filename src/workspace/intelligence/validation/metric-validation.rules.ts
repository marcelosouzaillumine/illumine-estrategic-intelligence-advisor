export interface MetricValidationRule {
  metric: string;
  expectedRange: {
    min: number;
    max: number;
  };
}

export const CFO_METRIC_RULES: MetricValidationRule[] = [
  {
    metric: 'ebitdaMargin',
    expectedRange: { min: -100, max: 100 } // percentage
  },
  {
    metric: 'revenueGrowth',
    expectedRange: { min: -100, max: 1000 } // percentage
  }
];
