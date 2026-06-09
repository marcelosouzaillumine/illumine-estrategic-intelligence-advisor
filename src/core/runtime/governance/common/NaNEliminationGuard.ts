export class NaNEliminationGuard {
  static sanitizeNumber(value: any, fallback: string | number = 'INSUFFICIENT_DATA'): number | string {
    if (value === null || value === undefined) return fallback;
    
    let num: number;
    if (typeof value === 'number') {
      num = value;
    } else if (typeof value === 'string') {
      num = Number(value);
    } else {
      return fallback;
    }

    if (Number.isNaN(num) || !Number.isFinite(num)) {
      return fallback;
    }

    return num;
  }

  static isSafe(value: any): boolean {
    if (value === null || value === undefined) return false;
    const num = Number(value);
    return !Number.isNaN(num) && Number.isFinite(num);
  }
}
