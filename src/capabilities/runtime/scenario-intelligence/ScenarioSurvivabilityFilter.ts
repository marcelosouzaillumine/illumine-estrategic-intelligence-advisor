import { ScenarioMutation } from './ScenarioMutation';

export class ScenarioSurvivabilityFilter {
  public static validate(baselineContext: any, mutations: ScenarioMutation[]): {
    status: 'VALID' | 'SCENARIO_SURVIVABILITY_CONFLICT';
  } {
    const runway = baselineContext.runwayMonths || 12;
    const isTreasuryRuptured = baselineContext.treasuryRuptureRisk === true;

    for (const mutation of mutations) {
      if (mutation.mutationId === 'CAPEX_EXPANSION' && runway < 3) {
        return { status: 'SCENARIO_SURVIVABILITY_CONFLICT' };
      }
      if (mutation.mutationId === 'DEBT_INCREASE' && isTreasuryRuptured) {
        return { status: 'SCENARIO_SURVIVABILITY_CONFLICT' };
      }
    }

    return { status: 'VALID' };
  }
}
