import { LocaleContext } from '../types';

export interface ScoreFormatOptions {
  scale?: number;
}

export class ScoreFormatter {
  static format(value: number, context: LocaleContext, options?: ScoreFormatOptions): string {
    const formatter = new Intl.NumberFormat(context.locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    
    const formattedValue = formatter.format(value);
    
    if (options?.scale) {
      return `${formattedValue}/${options.scale}`;
    }
    
    return formattedValue;
  }
}
