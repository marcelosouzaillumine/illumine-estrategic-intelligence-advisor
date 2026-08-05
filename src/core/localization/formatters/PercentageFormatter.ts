import { LocaleContext } from '../types';

export class PercentageFormatter {
  static format(value: number, context: LocaleContext, options?: Intl.NumberFormatOptions): string {
    const formatter = new Intl.NumberFormat(context.locale, {
      style: 'percent',
      maximumFractionDigits: 2,
      ...options,
    });
    return formatter.format(value); // Note: standard Intl expects 0.184 for 18.4%. Callers must pass the correct decimal.
  }
}
