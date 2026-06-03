export interface ScenarioComparison {
  metric: string;
  baselineValue: number;
  scenarioValue: number;
  variance: number;
  variancePercent: number;
}

export class ScenarioComparisonEngine {
  public static compare(baselineContext: any, scenarioContext: any): ScenarioComparison[] {
    const comparisons: ScenarioComparison[] = [];

    const baselineFCO = baselineContext.operationalCashFlow || 0;
    const scenarioFCO = scenarioContext.operationalCashFlow || 0;

    comparisons.push({
      metric: 'Cash Flow',
      baselineValue: baselineFCO,
      scenarioValue: scenarioFCO,
      variance: scenarioFCO - baselineFCO,
      variancePercent: baselineFCO !== 0 ? ((scenarioFCO - baselineFCO) / Math.abs(baselineFCO)) * 100 : 0
    });

    const baselineRunway = baselineContext.runwayMonths || 0;
    const scenarioRunway = scenarioContext.runwayMonths || 0;

    comparisons.push({
      metric: 'Runway',
      baselineValue: baselineRunway,
      scenarioValue: scenarioRunway,
      variance: scenarioRunway - baselineRunway,
      variancePercent: baselineRunway !== 0 ? ((scenarioRunway - baselineRunway) / Math.abs(baselineRunway)) * 100 : 0
    });

    return comparisons;
  }
}
