/**
 * ExecutiveNumericPresentationGuard
 * 
 * Prevents the rendering of NaN, Infinity, -Infinity, undefined, or null numerical fields 
 * on dashboard visual interfaces across the application.
 */
export class ExecutiveNumericPresentationGuard {
  /**
   * Checks if a numeric value is valid (finite and not NaN).
   */
  public static isValid(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') {
      return !isNaN(value) && isFinite(value);
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return !isNaN(parsed) && isFinite(parsed);
    }
    return false;
  }

  /**
   * Formats a value safely. If the value is invalid, returns the fallback string 'Não Disponível'.
   */
  public static formatSafe(value: unknown, formatter: (val: number) => string): string {
    if (!this.isValid(value)) {
      return 'Não Disponível';
    }
    return formatter(Number(value));
  }
}
