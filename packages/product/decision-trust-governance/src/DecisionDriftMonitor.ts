export interface DriftReport {
  readonly modelDriftPercent: number;
  readonly forecastErrorPercent: number;
  readonly isHealthy: boolean;
  readonly driftStatus: string;
}

export class DecisionDriftMonitor {
  public static evaluateDrift(historicalErrors: readonly number[]): DriftReport {
    if (historicalErrors.length === 0) {
      return { modelDriftPercent: 0, forecastErrorPercent: 0, isHealthy: true, driftStatus: 'Sem histórico de erro' };
    }
    const avgError = historicalErrors.reduce((a, b) => a + b, 0) / historicalErrors.length;
    const isHealthy = avgError < 5.0;

    return {
      modelDriftPercent: Number(avgError.toFixed(1)),
      forecastErrorPercent: Number(avgError.toFixed(1)),
      isHealthy,
      driftStatus: isHealthy ? 'Modelos Estáveis — Deriva sob controle' : 'Alerta de Deriva de Modelo — Recalibração recomendada'
    };
  }
}
