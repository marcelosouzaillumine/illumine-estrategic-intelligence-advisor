// Types and constants for the Executive Locale Infrastructure
export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';
export type SupportedCurrency = 'BRL' | 'USD' | 'EUR' | 'MXN' | 'GBP';

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';
export const DEFAULT_CURRENCY: SupportedCurrency = 'BRL';
export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

export interface LocaleContext {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  timezone: string;
}
