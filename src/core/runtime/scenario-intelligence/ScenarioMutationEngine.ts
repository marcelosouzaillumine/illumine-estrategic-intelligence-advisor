import { ScenarioMutation } from './ScenarioMutation';
import { ScenarioRegistry } from './ScenarioRegistry';

export class ScenarioMutationEngine {
  public static applyMutations(baselineContext: any, mutations: ScenarioMutation[]): any {
    // Clone baseline to enforce isolation rule
    const scenarioContext = JSON.parse(JSON.stringify(baselineContext));

    for (const mutation of mutations) {
      if (!ScenarioRegistry.isMutationApproved(mutation.mutationId)) {
        continue;
      }

      // Apply deterministic mutation logic
      switch (mutation.mutationId) {
        case 'CAPEX_EXPANSION':
          scenarioContext.operationalCashFlow -= mutation.value;
          scenarioContext.runwayMonths = Math.max(0, (scenarioContext.runwayMonths || 0) - (mutation.value / 100)); // synthetic math for testing
          break;
        case 'CAPEX_REDUCTION':
          scenarioContext.operationalCashFlow += mutation.value;
          break;
        case 'INVENTORY_REDUCTION':
          scenarioContext.inventoryDays = Math.max(0, (scenarioContext.inventoryDays || 0) - mutation.value);
          break;
        case 'DEBT_INCREASE':
          scenarioContext.treasuryRuptureRisk = true;
          break;
      }
    }

    return scenarioContext;
  }
}
