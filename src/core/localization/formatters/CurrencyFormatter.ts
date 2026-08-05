import { LocaleContext } from '../types';

export class CurrencyFormatter {
  static format(value: number, context: LocaleContext, options?: Intl.NumberFormatOptions): string {
    const formatter = new Intl.NumberFormat(context.locale, {
      style: 'currency',
      currency: context.currency,
      ...options,
    });
    return formatter.format(value);
  }
}
