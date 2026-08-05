import { LocaleContext } from '../types';

export class RelativeTimeFormatter {
  static format(value: number, unit: Intl.RelativeTimeFormatUnit, context: LocaleContext, options?: Intl.RelativeTimeFormatOptions): string {
    const formatter = new Intl.RelativeTimeFormat(context.locale, {
      numeric: 'auto',
      ...options,
    });
    return formatter.format(value, unit);
  }
}
