import { ScenarioExecutionBudget } from './ProfilingTypes';

export class ScenarioCostAnalyzer {
  /**
   * Verifica se o ambiente pode rodar um cenário antes de permitir sua execução.
   * Não altera a matemática, apenas atua como disjuntor computacional.
   */
  static validateBudget(currentMetrics: {
    scenariosRun: number,
    snapshotSizeKb: number,
    entitiesInvolved: number
  }, budget: ScenarioExecutionBudget): { allowed: boolean; reason?: string } {
    
    if (currentMetrics.scenariosRun >= budget.maxScenarios) {
      return { allowed: false, reason: 'Orçamento excedido: Limite máximo de cenários atingido.' };
    }

    if (currentMetrics.snapshotSizeKb > budget.maxSnapshotSizeKb) {
      return { allowed: false, reason: 'Orçamento excedido: Payload de Snapshot muito grande para clonagem.' };
    }

    if (currentMetrics.entitiesInvolved > budget.maxEntitiesPerSimulation) {
      return { allowed: false, reason: 'Orçamento excedido: Complexidade sistêmica (nº de entidades) acima do limite.' };
    }

    return { allowed: true };
  }
}
