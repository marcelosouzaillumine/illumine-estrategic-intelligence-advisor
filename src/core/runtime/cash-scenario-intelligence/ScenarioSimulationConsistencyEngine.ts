export interface SimulationConsistencyResult {
  hasConflict: boolean;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  narrative: string;
  executiveInterpretation: string;
}

export class ScenarioSimulationConsistencyEngine {
  /**
   * Evaluates the simulation inputs and detects consistency conflicts
   * when short-term cash/runway gains mask structural FCO deterioration.
   */
  public static evaluate(
    simulatedRunway: number,
    currentRunway: number,
    simulatedCash: number,
    currentCash: number,
    simulatedFco: number,
    currentFco: number
  ): SimulationConsistencyResult {
    // Conflict occurs if runway and cash both improve, but FCO deteriorates (decreases)
    const hasConflict = simulatedRunway > currentRunway && simulatedCash > currentCash && simulatedFco < currentFco;
    
    return {
      hasConflict,
      severity: hasConflict ? 'HIGH' : 'LOW',
      narrative: hasConflict
        ? 'Alerta de Interpretação: A melhora observada no caixa decorre de liberação temporária de capital de giro. A geração operacional estrutural permanece deteriorada. O contexto melhora a liquidez de ciclo imediato, mas não resolve a causa econômica do problema.'
        : 'A simulação não apresenta conflitos estruturais de consistência fiduciária.',
      executiveInterpretation: hasConflict
        ? 'A melhora observada no caixa decorre de liberação temporária de capital de giro. A geração operacional estrutural permanece deteriorada. O contexto melhora a liquidez de ciclo imediato, mas não resolve a causa econômica do problema.'
        : 'A simulação não apresenta conflitos estruturais de consistência fiduciária.'
    };
  }
}
