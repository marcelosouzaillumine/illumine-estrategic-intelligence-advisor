import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE_PREFERENCE } from './locale.types';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('illumine_locale_preference');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.language) return parsed.language;
      } catch (e) {}
    }
    
    // Also check i18next standard key as fallback if needed
    const i18nextSaved = localStorage.getItem('i18nextLng');
    if (i18nextSaved) return i18nextSaved;
  }
  return DEFAULT_LOCALE_PREFERENCE.language;
};

// Import pt-BR namespaces
import ptBrCommon from '../locales/pt-BR/common.json';
import ptBrDashboard from '../locales/pt-BR/dashboard.json';
import ptBrExecutive from '../locales/pt-BR/executive.json';
import ptBrMetrics from '../locales/pt-BR/metrics.json';
import ptBrReports from '../locales/pt-BR/reports.json';
import ptBrErrors from '../locales/pt-BR/errors.json';
import ptBrAi from '../locales/pt-BR/ai.json';
import ptBrInstitutional from '../locales/pt-BR/institutional.json';
import ptBrPlatform from '../locales/pt-BR/platform.json';
import ptBrDomains from '../locales/pt-BR/domains.json';
import ptBrGovernance from '../locales/pt-BR/governance.json';
import ptBrAdvisory from '../locales/pt-BR/advisory.json';
import ptBrPartners from '../locales/pt-BR/partners.json';
import ptBrPricing from '../locales/pt-BR/pricing.json';
import ptBrNavigation from '../locales/pt-BR/navigation.json';
import ptBrFooter from '../locales/pt-BR/footer.json';
import ptBrSeo from '../locales/pt-BR/seo.json';
import ptBrBrand from '../locales/pt-BR/brand.json';
import ptBrShowcasesCommand from '../locales/pt-BR/showcases/executive-command.json';
import ptBrShowcasesSystemic from '../locales/pt-BR/showcases/systemic-intelligence.json';
import ptBrShowcasesGovernance from '../locales/pt-BR/showcases/governance.json';

// Import en-US namespaces
import enUsCommon from '../locales/en-US/common.json';
import enUsDashboard from '../locales/en-US/dashboard.json';
import enUsExecutive from '../locales/en-US/executive.json';
import enUsMetrics from '../locales/en-US/metrics.json';
import enUsReports from '../locales/en-US/reports.json';
import enUsErrors from '../locales/en-US/errors.json';
import enUsAi from '../locales/en-US/ai.json';
import enUsInstitutional from '../locales/en-US/institutional.json';
import enUsPlatform from '../locales/en-US/platform.json';
import enUsDomains from '../locales/en-US/domains.json';
import enUsGovernance from '../locales/en-US/governance.json';
import enUsAdvisory from '../locales/en-US/advisory.json';
import enUsPartners from '../locales/en-US/partners.json';
import enUsPricing from '../locales/en-US/pricing.json';
import enUsNavigation from '../locales/en-US/navigation.json';
import enUsFooter from '../locales/en-US/footer.json';
import enUsSeo from '../locales/en-US/seo.json';
import enUsBrand from '../locales/en-US/brand.json';
import enUsShowcasesCommand from '../locales/en-US/showcases/executive-command.json';
import enUsShowcasesSystemic from '../locales/en-US/showcases/systemic-intelligence.json';
import enUsShowcasesGovernance from '../locales/en-US/showcases/governance.json';

// Import es-ES namespaces
import esEsCommon from '../locales/es-ES/common.json';
import esEsDashboard from '../locales/es-ES/dashboard.json';
import esEsExecutive from '../locales/es-ES/executive.json';
import esEsMetrics from '../locales/es-ES/metrics.json';
import esEsReports from '../locales/es-ES/reports.json';
import esEsErrors from '../locales/es-ES/errors.json';
import esEsAi from '../locales/es-ES/ai.json';
import esEsInstitutional from '../locales/es-ES/institutional.json';
import esEsPlatform from '../locales/es-ES/platform.json';
import esEsDomains from '../locales/es-ES/domains.json';
import esEsGovernance from '../locales/es-ES/governance.json';
import esEsAdvisory from '../locales/es-ES/advisory.json';
import esEsPartners from '../locales/es-ES/partners.json';
import esEsPricing from '../locales/es-ES/pricing.json';
import esEsNavigation from '../locales/es-ES/navigation.json';
import esEsFooter from '../locales/es-ES/footer.json';
import esEsSeo from '../locales/es-ES/seo.json';
import esEsBrand from '../locales/es-ES/brand.json';
import esEsShowcasesCommand from '../locales/es-ES/showcases/executive-command.json';
import esEsShowcasesSystemic from '../locales/es-ES/showcases/systemic-intelligence.json';
import esEsShowcasesGovernance from '../locales/es-ES/showcases/governance.json';

const resources = {
  'pt-BR': {
    common: ptBrCommon,
    dashboard: ptBrDashboard,
    executive: ptBrExecutive,
    metrics: ptBrMetrics,
    reports: ptBrReports,
    errors: ptBrErrors,
    ai: ptBrAi,
    institutional: ptBrInstitutional,
    platform: ptBrPlatform,
    domains: ptBrDomains,
    governance: ptBrGovernance,
    advisory: ptBrAdvisory,
    partners: ptBrPartners,
    pricing: ptBrPricing,
    navigation: ptBrNavigation,
    footer: ptBrFooter,
    seo: ptBrSeo,
    brand: ptBrBrand,
    'showcases/executive-command': ptBrShowcasesCommand,
    'showcases/systemic-intelligence': ptBrShowcasesSystemic,
    'showcases/governance': ptBrShowcasesGovernance
  },
  'en-US': {
    common: enUsCommon,
    dashboard: enUsDashboard,
    executive: enUsExecutive,
    metrics: enUsMetrics,
    reports: enUsReports,
    errors: enUsErrors,
    ai: enUsAi,
    institutional: enUsInstitutional,
    platform: enUsPlatform,
    domains: enUsDomains,
    governance: enUsGovernance,
    advisory: enUsAdvisory,
    partners: enUsPartners,
    pricing: enUsPricing,
    navigation: enUsNavigation,
    footer: enUsFooter,
    seo: enUsSeo,
    brand: enUsBrand,
    'showcases/executive-command': enUsShowcasesCommand,
    'showcases/systemic-intelligence': enUsShowcasesSystemic,
    'showcases/governance': enUsShowcasesGovernance
  },
  'es-ES': {
    common: esEsCommon,
    dashboard: esEsDashboard,
    executive: esEsExecutive,
    metrics: esEsMetrics,
    reports: esEsReports,
    errors: esEsErrors,
    ai: esEsAi,
    institutional: esEsInstitutional,
    platform: esEsPlatform,
    domains: esEsDomains,
    governance: esEsGovernance,
    advisory: esEsAdvisory,
    partners: esEsPartners,
    pricing: esEsPricing,
    navigation: esEsNavigation,
    footer: esEsFooter,
    seo: esEsSeo,
    brand: esEsBrand,
    'showcases/executive-command': esEsShowcasesCommand,
    'showcases/systemic-intelligence': esEsShowcasesSystemic,
    'showcases/governance': esEsShowcasesGovernance
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt-BR',
    ns: [
      'common', 'dashboard', 'executive', 'metrics', 'reports', 'errors', 'ai',
      'institutional', 'platform', 'domains', 'governance', 'advisory', 'partners', 'pricing', 'navigation', 'footer', 'seo', 'brand',
      'showcases/executive-command', 'showcases/systemic-intelligence', 'showcases/governance'
    ],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // To avoid suspense boundaries issues in legacy components initially
    }
  });

export default i18n;
