export class InvalidMetricGuard {
  public static safeDivide(
    numerator: number,
    denominator: number,
    fallbackType: 'NOT_APPLICABLE' | 'INSUFFICIENT' | 'UNCOMPARABLE' = 'NOT_APPLICABLE'
  ): number | string {
    const fallbackText = this.getFallbackText(fallbackType);

    if (denominator === 0 || isNaN(denominator) || denominator === null || denominator === undefined) {
      return fallbackText;
    }

    const val = numerator / denominator;
    if (isNaN(val) || !isFinite(val)) {
      return fallbackText;
    }

    return val;
  }

  public static sanitize(val: any, fallbackType: 'NOT_APPLICABLE' | 'INSUFFICIENT' | 'UNCOMPARABLE' = 'NOT_APPLICABLE'): any {
    if (val === null || val === undefined) {
      return val;
    }

    if (typeof val === 'number') {
      if (isNaN(val) || !isFinite(val)) {
        return this.getFallbackText(fallbackType);
      }
    }

    return val;
  }

  private static getFallbackText(type: 'NOT_APPLICABLE' | 'INSUFFICIENT' | 'UNCOMPARABLE'): string {
    switch (type) {
      case 'NOT_APPLICABLE':
        return 'Não aplicável';
      case 'INSUFFICIENT':
        return 'Base de cálculo insuficiente';
      case 'UNCOMPARABLE':
        return 'Estrutura não comparável';
      default:
        return 'Não aplicável';
    }
  }
}
