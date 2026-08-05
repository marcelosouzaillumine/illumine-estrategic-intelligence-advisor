import { LocaleContext } from '../types';

export class ListFormatter {
  static format(list: string[], context: LocaleContext, options?: Intl.ListFormatOptions): string {
    const formatter = new Intl.ListFormat(context.locale, {
      style: 'long',
      type: 'conjunction',
      ...options,
    });
    return formatter.format(list);
  }
}
