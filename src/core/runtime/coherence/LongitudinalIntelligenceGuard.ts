export interface LongitudinalGuardResult {
  hasSufficientHistory: boolean;
  evolutionScoreHidden: boolean;
  evolutionWeightMultiplier: number;
  institutionalDisclosure: string | null;
}

export class LongitudinalIntelligenceGuard {
  /**
   * Avalia a densidade histórica para proteger a epistemologia do runtime.
   * - 1 ano: bloqueia score evolutivo e emite disclosure.
   * - 2 anos: permite comparação, mas pode bloquear certas tendências estruturais definitivas.
   * - >= 3 anos: libera as inferências de forma progressiva.
   */
  public static evaluate(historicalCyclesCount: number): LongitudinalGuardResult {
    if (historicalCyclesCount <= 1) {
      return {
        hasSufficientHistory: false,
        evolutionScoreHidden: true,
        evolutionWeightMultiplier: 0.0,
        institutionalDisclosure: 'Ausência de densidade histórica para inferências evolutivas ou de consolidação.'
      };
    }

    if (historicalCyclesCount === 2) {
      return {
        hasSufficientHistory: true, // we have history, but maybe limited
        evolutionScoreHidden: false,
        evolutionWeightMultiplier: 1.0,
        institutionalDisclosure: 'Histórico inicial restrito a um ciclo comparativo. Tendências estruturais bloqueadas.'
      };
    }

    return {
      hasSufficientHistory: true,
      evolutionScoreHidden: false,
      evolutionWeightMultiplier: 1.0,
      institutionalDisclosure: null
    };
  }

  /**
   * Recalcula os pesos do Composite Score quando a evolução é ocultada.
   * Remove o peso evolutivo (ex: 20%) e redistribui proporcionalmente para os outros.
   */
  public static recalibrateWeights(baseWeights: Record<string, number>): Record<string, number> {
    const { evolution, ...remaining } = baseWeights;
    
    // Se evolução não estava lá ou era 0, retorna igual
    if (!evolution || evolution === 0) return baseWeights;

    const remainingTotal = Object.values(remaining).reduce((acc, val) => acc + val, 0);
    
    if (remainingTotal === 0) return remaining;

    const factor = 1 / remainingTotal; // Scale to 100% since remainingTotal represents (1 - evolution)
    
    const recalibrated: Record<string, number> = {};
    for (const [key, val] of Object.entries(remaining)) {
      recalibrated[key] = val * factor;
    }
    
    return recalibrated;
  }
}
