import { SupportedLanguage } from '../config/locale.types';

export class LocaleResolutionService {
  /**
   * Resolves the active language based on priority:
   * 1. User Preference (authenticated)
   * 2. URL Segment (e.g., /en)
   * 3. Browser Locale (navigator.language)
   * 4. Default Platform Locale (pt-BR)
   */
  public static resolveLanguage(
    userPreferenceLanguage?: SupportedLanguage | null,
    pathName?: string
  ): SupportedLanguage {
    // 1. User Preference
    if (userPreferenceLanguage) {
      return this.normalizeLanguage(userPreferenceLanguage);
    }

    // 2. URL Segment
    const currentPath = pathName || (typeof window !== 'undefined' ? window.location.pathname : '');
    if (currentPath.startsWith('/en')) return 'en-US';
    if (currentPath.startsWith('/es')) return 'es-ES';
    if (currentPath.startsWith('/pt')) return 'pt-BR';

    // 3. Browser Locale
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) return 'en-US';
      if (browserLang.startsWith('es')) return 'es-ES';
      if (browserLang.startsWith('pt')) return 'pt-BR';
    }

    // 4. Default Platform Locale
    return 'pt-BR';
  }

  private static normalizeLanguage(lang: string): SupportedLanguage {
    if (lang.includes('en')) return 'en-US';
    if (lang.includes('es')) return 'es-ES';
    return 'pt-BR';
  }
}
