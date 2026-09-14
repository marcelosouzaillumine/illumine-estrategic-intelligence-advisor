import { ScenarioComparison, StrategicSimulationResult } from './StrategicSimulationTypes';

export class MultiScenarioComparisonEngine {
  static compare(baseSim: StrategicSimulationResult, altSim: StrategicSimulationResult): ScenarioComparison {
    return {
      comparisonId: 'COMP-' + Date.now(),
      tenantId: baseSim.tenantId,
      baseScenarioId: baseSim.simulationId,
      alternativeScenarioId: altSim.simulationId,
      resilienceDelta: altSim.resilience.postDecisionScore - baseSim.resilience.postDecisionScore,
      liquidityDelta: 0.1, // mock,
      governanceDelta: -0.05 // mock
    };
  }
}
