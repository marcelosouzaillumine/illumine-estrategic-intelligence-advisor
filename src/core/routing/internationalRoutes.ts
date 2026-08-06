export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';

export type RouteKey = 
  | 'HOME'
  | 'MANIFESTO'
  | 'WHY'
  | 'PLATFORM'
  | 'DOMAINS'
  | 'GOVERNANCE'
  | 'INTELLIGENCE_CENTER'
  | 'DIAGNOSTIC'
  | 'CONTACT'
  | 'PARTNERS'
  | 'ADVISOR_NETWORK'
  | 'LOGIN'
  | 'NONPROFIT'
  | 'ENTERPRISE'
  | 'SECURITY'
  | 'PRIVACY'
  | 'ADVISOR_PARTNER'
  | 'PLANS';

export const routePrefixes: Record<SupportedLocale, string> = {
  'pt-BR': '/pt',
  'en-US': '/en',
  'es-ES': '/es'
};

/**
 * Single Source of Truth for Canonical Routes
 * Slugs MUST NOT be translated.
 */
export const internationalRoutes: Record<RouteKey, string> = {
  HOME: '/',
  MANIFESTO: '/manifesto',
  WHY: '/why-illumine',
  PLATFORM: '/platform',
  DOMAINS: '/domains',
  GOVERNANCE: '/governance',
  INTELLIGENCE_CENTER: '/intelligence-center',
  DIAGNOSTIC: '/assessment',
  CONTACT: '/contact',
  PARTNERS: '/partners',
  ADVISOR_NETWORK: '/advisor-network',
  LOGIN: '/login',
  NONPROFIT: '/nonprofit',
  ENTERPRISE: '/enterprise',
  SECURITY: '/security',
  PRIVACY: '/privacy',
  ADVISOR_PARTNER: '/advisor-partner',
  PLANS: '/plans'
};

/**
 * Legacy Aliases Registry
 * Used for Redirects to preserve backward compatibility (SEO/Shared Links).
 */
export const legacyAliases: Record<string, RouteKey> = {
  // PT-BR legacy
  '/plataforma': 'PLATFORM',
  '/governanca': 'GOVERNANCE',
  '/dominios': 'DOMAINS',
  '/diagnostico': 'DIAGNOSTIC',
  '/parceiros': 'PARTNERS',
  '/centro-de-inteligencia': 'INTELLIGENCE_CENTER',
  '/por-que-illumine': 'WHY',
  '/contato': 'CONTACT',
  '/entrar': 'LOGIN',
  '/acessar': 'LOGIN',
  '/network': 'ADVISOR_NETWORK',
  '/advisory': 'ADVISOR_NETWORK',
  '/programa-parceiros': 'ADVISOR_NETWORK',
  '/executive-advisor-network': 'ADVISOR_NETWORK',
  '/executiveadvisornetwork': 'ADVISOR_NETWORK',
  '/programa-advisors': 'ADVISOR_PARTNER',
  '/advisor-programs': 'ADVISOR_PARTNER',
  '/pricing': 'PLANS',
  '/planos': 'PLANS',
  // ES-ES legacy (if any existed before)
  '/manifiesto': 'MANIFESTO',
  '/gobernanza': 'GOVERNANCE',
  '/evaluacion': 'DIAGNOSTIC',
  '/contacto': 'CONTACT',
  '/socios': 'PARTNERS',
  '/iniciar-sesion': 'LOGIN'
};

/**
 * Gets the localized path for a given route key and locale.
 * Example: getLocalizedRoute('PLATFORM', 'en-US') -> '/en/platform'
 */
export function getLocalizedRoute(key: RouteKey, locale: SupportedLocale): string {
  const prefix = routePrefixes[locale];
  const path = internationalRoutes[key];
  
  // Home is a special case: /pt instead of /pt/
  if (path === '/') return prefix;
  
  return `${prefix}${path}`;
}

/**
 * Reverses a path to its generic RouteKey (useful for SEO mapping)
 * Checks both Canonical and Legacy Aliases.
 */
export function getRouteKeyFromPath(pathname: string): RouteKey | undefined {
  // Strip prefix first
  let cleanPath = pathname;
  for (const prefix of Object.values(routePrefixes)) {
    if (pathname.startsWith(prefix)) {
      cleanPath = pathname.substring(prefix.length) || '/';
      break;
    }
  }

  // Check Canonical exact match
  for (const [key, path] of Object.entries(internationalRoutes)) {
    if (path === cleanPath) {
      return key as RouteKey;
    }
  }

  // Check Legacy aliases
  if (legacyAliases[cleanPath]) {
    return legacyAliases[cleanPath];
  }

  return undefined;
}
