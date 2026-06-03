// src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts
import { ScenarioInput, InstitutionalScenarioResult } from './scenario-types';
import { ScenarioConstraintEngine } from './ScenarioConstraintEngine';
import { PropagationSimulationEngine } from './PropagationSimulationEngine';
import { InstitutionalStressTestEngine } from './InstitutionalStressTestEngine';
import { ScenarioExplainabilityEngine } from './ScenarioExplainabilityEngine';
import { ScenarioStabilityEngine } from './ScenarioStabilityEngine';

export class InstitutionalScenarioEngine {
  public static evaluateScenario(inputs: ScenarioInput[], contextData: any): InstitutionalScenarioResult {
    const id = `SCENARIO_${Date.now()}`;
    
    // 1. Constraint Enforcement (Fail-Closed)
    const validation = ScenarioConstraintEngine.validate(inputs, contextData);
    if (validation.status !== 'VALID') {
      return { id, inputs, validation };
    }

    // 2. Propagation Simulation
    const propagationProfile = PropagationSimulationEngine.simulate(inputs, contextData);

    // 3. Stress Testing (Impact evaluation)
    // const stressResult = InstitutionalStressTestEngine.execute(inputs, propagationProfile, contextData);

    // 4. Stabilize Hysteresis
    let result: InstitutionalScenarioResult = { id, inputs, validation, propagationProfile };
    result = ScenarioStabilityEngine.stabilize(result);

    // 5. Explainability & Lineage
    const explainability = ScenarioExplainabilityEngine.generatePayload(contextData, inputs, validation, result.propagationProfile);
    result.explainability = explainability;

    return result;
  }
}
