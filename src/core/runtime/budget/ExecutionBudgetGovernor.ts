import { ScenarioExecutionBudget } from '../profiling/ProfilingTypes';

const DEFAULT_BUDGET: ScenarioExecutionBudget = {
  maxScenarios: 50,
  maxReplays: 10,
  maxSnapshotSizeKb: 50 * 1024, // 50 MB
  maxExecutionTimeMs: 15000,    // 15 sec
  maxPropagationDepth: 5,       // Max 5 saltos de contágio
  maxEntitiesPerSimulation: 500 // Max 500 CNPJs na topologia
};

export class ExecutionBudgetGovernor {
  /**
   * Valida estritamente se as dimensões da operação violam os limites da plataforma.
   */
  static enforceBudget(metrics: Partial<ScenarioExecutionBudget>): boolean {
    if (metrics.maxScenarios && metrics.maxScenarios > DEFAULT_BUDGET.maxScenarios) {
      console.warn(`[ExecutionBudgetGovernor] CRÍTICO: Tentativa de estourar limite de cenários. Máximo: ${DEFAULT_BUDGET.maxScenarios}`);
      return false;
    }

    if (metrics.maxPropagationDepth && metrics.maxPropagationDepth > DEFAULT_BUDGET.maxPropagationDepth) {
      console.warn(`[ExecutionBudgetGovernor] CRÍTICO: Tentativa de estourar limite de saltos de contágio. Máximo: ${DEFAULT_BUDGET.maxPropagationDepth}`);
      return false;
    }

    if (metrics.maxSnapshotSizeKb && metrics.maxSnapshotSizeKb > DEFAULT_BUDGET.maxSnapshotSizeKb) {
      console.warn(`[ExecutionBudgetGovernor] CRÍTICO: Tentativa de carregar payload massivo. Máximo: ${DEFAULT_BUDGET.maxSnapshotSizeKb} KB`);
      return false;
    }

    return true;
  }
}
