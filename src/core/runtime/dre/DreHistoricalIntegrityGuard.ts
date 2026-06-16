export interface HistoricalSanitizationResult {
  growthRate: number;
  isMeaningful: boolean;
  message: string | null;
}

export class DreHistoricalIntegrityGuard {
  /**
   * Sanitizes historical growth calculations.
   * Prevents division by zero, negative base distortions, and extreme percentages.
   */
  public static sanitizeGrowth(currentValue: number, previousValue: number | undefined | null): HistoricalSanitizationResult {
    if (previousValue === undefined || previousValue === null) {
      return { growthRate: 0, isMeaningful: false, message: "Análise longitudinal limitada pela quantidade de exercícios comparáveis." };
    }

    // Se base anterior for negativa, zero, ausente ou não comparável, exibir “Comparabilidade limitada”
    if (previousValue <= 0) {
      // It might be a recovery from negative to positive, but mathematically the percentage is misleading.
      return { growthRate: 0, isMeaningful: false, message: "Comparabilidade limitada devido a base histórica nula ou negativa." };
    }

    const growth = (currentValue - previousValue) / previousValue;

    // Variações absurdas como -4079% ou +4182%
    // If the growth is more than 500% (5.0) or less than -100% (-1.0), it's considered mathematically true but executively misleading.
    if (growth > 10.0 || growth < -1.0) {
       return { growthRate: growth, isMeaningful: false, message: "Variação extrema: comparabilidade executiva restrita sem nota técnica complementar." };
    }

    return { growthRate: growth, isMeaningful: true, message: null };
  }
}
