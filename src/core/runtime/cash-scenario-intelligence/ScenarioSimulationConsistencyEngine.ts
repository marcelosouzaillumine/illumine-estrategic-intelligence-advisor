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
        ? 'Aviso Técnico: A simulação indica melhoria de caixa/runway no curto prazo devido à liberação de capital de giro, porém com deterioração do Fluxo de Caixa Operacional (FCO) estrutural.'
        : 'A simulação não apresenta conflitos estruturais de consistência fiduciária.',
      executiveInterpretation: hasConflict
        ? 'A melhoria observada no caixa e no runway decorre principalmente da liberação temporária de capital de giro. Apesar do ganho de liquidez de curto prazo, a capacidade estrutural de geração operacional deteriorou-se. O cenário melhora a sobrevivência imediata, mas reduz a sustentabilidade econômica de longo prazo.'
        : 'A simulação não apresenta conflitos estruturais de consistência fiduciária.'
    };
  }
}
