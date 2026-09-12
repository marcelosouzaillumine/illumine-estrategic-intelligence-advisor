export class BalanceSheetExecutivePresentationGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static sanitize(value: string | number | undefined | null): string | number {
    if (value === undefined || value === null) {
      return 'Não calculável com os dados disponíveis';
    }

    if (typeof value === 'number' && isNaN(value)) {
      return 'Não calculável com os dados disponíveis';
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toUpperCase();
      if (normalized === 'INSUFFICIENT_DATA' || normalized === 'NAN' || normalized === 'UNDEFINED' || normalized === 'NULL') {
        return 'Não calculável com os dados disponíveis';
      }
    }

    return value;
  }
}
