import { useTranslation } from 'react-i18next';
import { RouteKey, getLocalizedRoute } from '../../routing/internationalRoutes';
import { generateHreflangTags } from '../utils/hreflang';
import { generateCanonicalUrl } from '../utils/canonical';

interface SeoConfig {
  pageKey: RouteKey;
  schemaTypes?: ('softwareApplication' | 'organization' | 'website')[];
}

const SEO_KEY_MAP: Record<RouteKey, string> = {
  HOME: 'home',
  MANIFESTO: 'manifesto',
  WHY: 'why',
  PLATFORM: 'platform',
  DOMAINS: 'domains',
  GOVERNANCE: 'governance',
  INTELLIGENCE_CENTER: 'intelligenceCenter',
  DIAGNOSTIC: 'assessment',
  CONTACT: 'contact',
  PARTNERS: 'partners',
  LOGIN: 'login',
  ADVISOR_NETWORK: 'advisorNetwork',
  NONPROFIT: 'nonprofit',
  ENTERPRISE: 'enterprise',
  SECURITY: 'security',
  PRIVACY: 'privacy',
  ADVISOR_PARTNER: 'advisorPartner',
  PLANS: 'plans',
  NONPROFIT_PLANS: 'nonprofitPlans',
  PITCH: 'pitch'
};

export function useSeo({ pageKey, schemaTypes }: SeoConfig) {
  const { t, i18n } = useTranslation(['seo', 'brand']);
  const currentLang = i18n.language;
  const baseUrl = 'https://illumineintelligence.com';

  const tKey = SEO_KEY_MAP[pageKey] || pageKey.toLowerCase();

  const title = t(`seo:${tKey}.title`);
  const description = t(`seo:${tKey}.description`);
  const keywords = t(`seo:${tKey}.keywords`);

  const canonicalUrl = generateCanonicalUrl(baseUrl, pageKey, currentLang);
  const hreflangTags = generateHreflangTags(baseUrl, pageKey);

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    hreflangTags,
    currentLang
  };
}
