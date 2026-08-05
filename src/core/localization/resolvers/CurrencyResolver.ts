import { SupportedCurrency, SupportedLocale, DEFAULT_CURRENCY } from '../types';
import { UserPreferences, TenantSettings } from './LocaleResolver';

export class CurrencyResolver {
  static resolve(
    userPref?: UserPreferences,
    tenantSettings?: TenantSettings,
    resolvedLocale?: SupportedLocale
  ): SupportedCurrency {
    const isValidCurrency = (c?: string): c is SupportedCurrency => {
      return c === 'BRL' || c === 'USD' || c === 'EUR' || c === 'MXN' || c === 'GBP';
    };

    if (isValidCurrency(userPref?.currency)) return userPref.currency;
    if (isValidCurrency(tenantSettings?.defaultCurrency)) return tenantSettings.defaultCurrency;

    // Infer from locale if not explicitly set by user or tenant
    if (resolvedLocale === 'en-US') return 'USD';
    if (resolvedLocale === 'es-ES') return 'EUR';
    if (resolvedLocale === 'pt-BR') return 'BRL';

    return DEFAULT_CURRENCY;
  }
}
