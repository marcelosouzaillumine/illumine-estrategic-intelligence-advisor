import { SupportedLocale, SupportedCurrency, DEFAULT_LOCALE, DEFAULT_CURRENCY } from './types';
import { LocaleResolver, UserPreferences, TenantSettings } from './resolvers/LocaleResolver';
import { CurrencyResolver } from './resolvers/CurrencyResolver';

export class TenantLocaleService {
  private static instance: TenantLocaleService;
  
  private constructor() {}

  static getInstance(): TenantLocaleService {
    if (!TenantLocaleService.instance) {
      TenantLocaleService.instance = new TenantLocaleService();
    }
    return TenantLocaleService.instance;
  }

  /**
   * Resolve the active locale based on the strict hierarchy:
   * 1. User Preference
   * 2. Tenant Settings
   * 3. URL Parameter
   * 4. Browser Locale
   * 5. Fallback Default
   */
  resolveActiveLocale(
    userPref?: UserPreferences,
    tenantSettings?: TenantSettings,
    urlParam?: string,
    browserLocale?: string
  ): SupportedLocale {
    return LocaleResolver.resolve(userPref, tenantSettings, urlParam, browserLocale);
  }

  /**
   * Resolve the active currency based on the strict hierarchy:
   * 1. User Preference
   * 2. Tenant Settings
   * 3. Fallback Default
   */
  resolveActiveCurrency(
    userPref?: UserPreferences,
    tenantSettings?: TenantSettings
  ): SupportedCurrency {
    return CurrencyResolver.resolve(userPref, tenantSettings);
  }
}

export const tenantLocaleService = TenantLocaleService.getInstance();
