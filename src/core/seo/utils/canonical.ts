import { RouteKey, getLocalizedRoute, SupportedLocale } from '../../routing/internationalRoutes';

export function generateCanonicalUrl(baseUrl: string, pageKey: RouteKey, currentLang: string): string {
  const path = getLocalizedRoute(pageKey, currentLang as SupportedLocale);
  return `${baseUrl}${path}`;
}
