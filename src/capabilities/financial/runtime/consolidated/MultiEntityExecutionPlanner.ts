import { ConsolidatedOrchestratorInput, EntityInputPayload } from './consolidated-types';

export class MultiEntityExecutionPlanner {
  
  /**
   * Identifica a topologia e ordena a execução de baixo para cima (bottom-up).
   * Subsidiárias/Filiais devem ser resolvidas antes da Holding.
   */
  public planExecution(input: ConsolidatedOrchestratorInput): EntityInputPayload[] {
    if (!input.entities || input.entities.length === 0) {
      return [];
    }

    // In a real DAG we would topological sort based on parentId.
    // For this phase, we simply sort so Holdings are processed last.
    return [...input.entities].sort((a, b) => {
      if (a.role === 'Holding' && b.role !== 'Holding') return 1;
      if (a.role !== 'Holding' && b.role === 'Holding') return -1;
      return 0;
    });
  }
}
