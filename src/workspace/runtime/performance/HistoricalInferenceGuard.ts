export interface HistoricalInferenceContext {
  availablePeriods: number;
  isReconciled: boolean;
  isComparable: boolean;
}

export interface HistoricalInferenceResult<T> {
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  value: T | null;
  institutionalMessage?: string;
}

export class HistoricalInferenceGuard {
  private static readonly MINIMUM_PERIODS = 2;
  private static readonly UNAVAILABLE_MESSAGE = 'Base histórica insuficiente para inferências longitudinais. A análise evolutiva requer no mínimo dois exercícios válidos, reconciliados e comparáveis.';

  /**
   * Valida se a base histórica atende aos critérios fiduciários para inferência longitudinal.
   * Se não atender, bloqueia a inferência e retorna status NOT_AVAILABLE.
   */
  public static validateInference<T>(
    context: HistoricalInferenceContext,
    computedValue: T
  ): HistoricalInferenceResult<T> {
    if (
      context.availablePeriods < this.MINIMUM_PERIODS ||
      !context.isReconciled ||
      !context.isComparable
    ) {
      return {
        status: 'NOT_AVAILABLE',
        value: null,
        institutionalMessage: this.UNAVAILABLE_MESSAGE
      };
    }

    return {
      status: 'AVAILABLE',
      value: computedValue
    };
  }
}
