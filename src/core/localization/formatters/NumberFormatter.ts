import { LocaleContext } from '../types';

export class NumberFormatter {
  static format(value: number, context: LocaleContext, options?: Intl.NumberFormatOptions): string {
    const formatter = new Intl.NumberFormat(context.locale, {
      style: 'decimal',
      ...options,
    });
    return formatter.format(value);
  }
}
