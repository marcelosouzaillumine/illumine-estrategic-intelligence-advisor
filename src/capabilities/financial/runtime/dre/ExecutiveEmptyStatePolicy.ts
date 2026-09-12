export type ExecutiveEmptyStateReason = 
  | 'INSUFFICIENT_HISTORY' 
  | 'INSUFFICIENT_DATA' 
  | 'NOT_APPLICABLE';

export type ExecutiveMetricResult<T> =
  | { available: true; value: T; sourceMetrics: Record<string, unknown>; confidenceLevel: number }
  | { available: false; reason: ExecutiveEmptyStateReason; missingFields?: string[] };

export class ExecutiveEmptyStatePolicy {
  public static getFallbackMessage(reason: ExecutiveEmptyStateReason): string {
    switch(reason) {
      case 'INSUFFICIENT_HISTORY': 
        return 'Histórico insuficiente para inferência longitudinal.';
      case 'INSUFFICIENT_DATA': 
        return 'Dados insuficientes para análise executiva desta seção.';
      case 'NOT_APPLICABLE': 
        return 'Análise não aplicável para o contexto atual.';
      default: 
        return 'Dados insuficientes para análise executiva desta seção.';
    }
  }
}
