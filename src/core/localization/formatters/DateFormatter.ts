import { LocaleContext } from '../types';

export class DateFormatter {
  static format(date: Date | number | string, context: LocaleContext, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = new Date(date);
    
    // Default executive format if no options provided
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: context.locale === 'pt-BR' || context.locale === 'es-ES' ? '2-digit' : 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    };

    const formatter = new Intl.DateTimeFormat(context.locale, {
      timeZone: context.timezone,
      ...(options || defaultOptions),
    });
    return formatter.format(dateObj);
  }
}
