import { RouteKey, getLocalizedRoute, routePrefixes, SupportedLocale } from '../../routing/internationalRoutes';

export interface HreflangTag {
  href: string;
  hreflang: string;
}

export function generateHreflangTags(baseUrl: string, pageKey: RouteKey): HreflangTag[] {
  const locales = Object.keys(routePrefixes) as SupportedLocale[];
  
  const tags = locales.map(locale => {
    // map pt-BR -> pt, en-US -> en
    const langCode = locale.split('-')[0];
    return {
      href: `${baseUrl}${getLocalizedRoute(pageKey, locale)}`,
      hreflang: langCode
    };
  });

  // x-default goes to English
  tags.push({
    href: `${baseUrl}${getLocalizedRoute(pageKey, 'en-US')}`,
    hreflang: 'x-default'
  });

  return tags;
}
