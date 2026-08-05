import { LocaleContext } from '../types';

export class DisplayNamesFormatter {
  static format(code: string, context: LocaleContext, options?: Intl.DisplayNamesOptions): string {
    const formatter = new Intl.DisplayNames([context.locale], {
      type: 'region',
      ...options,
    });
    return formatter.of(code) || code;
  }
}
