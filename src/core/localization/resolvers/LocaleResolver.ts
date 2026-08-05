import { SupportedLocale, DEFAULT_LOCALE } from '../types';

export interface UserPreferences {
  locale?: string;
  currency?: string;
  timezone?: string;
}

export interface TenantSettings {
  defaultLocale?: string;
  defaultCurrency?: string;
  defaultTimezone?: string;
}

/**
 * Resolves the locale to use based on the strict hierarchy:
 * 1. User Preference (never overridden by tenant)
 * 2. Tenant Settings (default for new users of the tenant)
 * 3. URL (if explicitly set in URL params, optional)
 * 4. Browser preference
 * 5. Default fallback
 */
export class LocaleResolver {
  static resolve(
    userPref?: UserPreferences,
    tenantSettings?: TenantSettings,
    urlParam?: string,
    browserLocale?: string
  ): SupportedLocale {
    const isValidLocale = (l?: string): l is SupportedLocale => {
      return l === 'pt-BR' || l === 'en-US' || l === 'es-ES';
    };

    if (isValidLocale(userPref?.locale)) return userPref.locale;
    if (isValidLocale(tenantSettings?.defaultLocale)) return tenantSettings.defaultLocale;
    if (isValidLocale(urlParam)) return urlParam;
    
    // Attempt to map browser locale
    if (browserLocale) {
      if (browserLocale.startsWith('pt')) return 'pt-BR';
      if (browserLocale.startsWith('es')) return 'es-ES';
      if (browserLocale.startsWith('en')) return 'en-US';
    }

    return DEFAULT_LOCALE;
  }
}
