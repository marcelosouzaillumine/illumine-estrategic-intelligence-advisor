export interface EFOSScenarioContext {
  scenarioId: string;
  scenarioName: string;
  enterpriseValue: number;
  valueDelta: number;
  projectedRevenueGrowth: number; // percentage
  projectedCapexGrowth: number; // percentage or absolute scale
  projectedOperationalComplexity: number; // calculated 0-100
}

export function adaptScenarioToEFOSInput(
  scenarioId: string,
  scenarioName: string,
  baselineRevenue: number,
  incrementalRevenue: number,
  baselineCapex: number,
  incrementalCapex: number,
  enterpriseValue: number,
  valueDelta: number
): EFOSScenarioContext {
  const projectedRevenueGrowth = baselineRevenue > 0 ? (incrementalRevenue / baselineRevenue) * 100 : 0;
  const projectedCapexGrowth = baselineCapex > 0 ? (incrementalCapex / baselineCapex) * 100 : (incrementalCapex > 0 ? 100 : 0);
  
  // Complexity heuristic: high capex and high revenue growth = high complexity
  // Cap at 100
  let projectedOperationalComplexity = (projectedRevenueGrowth * 0.6) + (projectedCapexGrowth * 0.4);
  if (projectedOperationalComplexity > 100) projectedOperationalComplexity = 100;
  if (projectedOperationalComplexity < 0) projectedOperationalComplexity = 0;

  return {
    scenarioId,
    scenarioName,
    enterpriseValue,
    valueDelta,
    projectedRevenueGrowth,
    projectedCapexGrowth,
    projectedOperationalComplexity
  };
}
