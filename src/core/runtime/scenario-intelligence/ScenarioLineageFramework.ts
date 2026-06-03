import { InstitutionalScenario } from './ScenarioDefinition';

export class ScenarioLineageFramework {
  public static validate(scenario: InstitutionalScenario): {
    status: 'VALID' | 'SCENARIO_WITHOUT_LINEAGE';
  } {
    if (!scenario.baselineHash || scenario.mutations.length === 0) {
      return { status: 'SCENARIO_WITHOUT_LINEAGE' };
    }

    for (const mutation of scenario.mutations) {
      if (!mutation.decisionId || !mutation.actionId) {
        return { status: 'SCENARIO_WITHOUT_LINEAGE' };
      }
    }

    return { status: 'VALID' };
  }
}
