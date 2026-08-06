import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE_PREFERENCE } from './locale.types';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('illumine-language');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'string') {
          return parsed;
        }
        if (parsed && typeof parsed === 'object' && parsed.language) {
          return parsed.language;
        }
      } catch (e) {
        // Not JSON, just return the raw string
        return saved;
      }
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
import ptBrIntelligenceCenter from '../locales/pt-BR/intelligence-center.json';
import ptBrAssessment from '../locales/pt-BR/diagnostic.json';
import ptBrWorkspace from '../locales/pt-BR/workspace.json';
import ptBrSettings from '../locales/pt-BR/settings.json';
import ptBrPermissions from '../locales/pt-BR/permissions.json';
import ptBrAdvisoryRecommendations from '../locales/pt-BR/advisory/recommendations.json';
import ptBrAdvisoryInsights from '../locales/pt-BR/advisory/insights.json';
import ptBrAdvisoryActions from '../locales/pt-BR/advisory/actions.json';
import ptBrAdvisorNetwork from '../locales/pt-BR/advisor-network.json';
import ptBrNonprofit from '../locales/pt-BR/nonprofit.json';
import ptBrEnterprise from '../locales/pt-BR/enterprise.json';
import ptBrAdvisorPartner from '../locales/pt-BR/advisor-partner.json';

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
import enUsIntelligenceCenter from '../locales/en-US/intelligence-center.json';
import enUsAssessment from '../locales/en-US/diagnostic.json';
import enUsWorkspace from '../locales/en-US/workspace.json';
import enUsSettings from '../locales/en-US/settings.json';
import enUsPermissions from '../locales/en-US/permissions.json';
import enUsAdvisoryRecommendations from '../locales/en-US/advisory/recommendations.json';
import enUsAdvisoryInsights from '../locales/en-US/advisory/insights.json';
import enUsAdvisoryActions from '../locales/en-US/advisory/actions.json';
import enUsAdvisorNetwork from '../locales/en-US/advisor-network.json';
import enUsNonprofit from '../locales/en-US/nonprofit.json';
import enUsEnterprise from '../locales/en-US/enterprise.json';
import enUsAdvisorPartner from '../locales/en-US/advisor-partner.json';

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
import esEsIntelligenceCenter from '../locales/es-ES/intelligence-center.json';
import esEsAssessment from '../locales/es-ES/diagnostic.json';
import esEsWorkspace from '../locales/es-ES/workspace.json';
import esEsSettings from '../locales/es-ES/settings.json';
import esEsPermissions from '../locales/es-ES/permissions.json';
import esEsAdvisoryRecommendations from '../locales/es-ES/advisory/recommendations.json';
import esEsAdvisoryInsights from '../locales/es-ES/advisory/insights.json';
import esEsAdvisoryActions from '../locales/es-ES/advisory/actions.json';
import esEsAdvisorNetwork from '../locales/es-ES/advisor-network.json';
import esEsNonprofit from '../locales/es-ES/nonprofit.json';
import esEsEnterprise from '../locales/es-ES/enterprise.json';
import esEsAdvisorPartner from '../locales/es-ES/advisor-partner.json';

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
    'showcases/governance': ptBrShowcasesGovernance,
    'intelligence-center': ptBrIntelligenceCenter,
    'diagnostic': ptBrAssessment,
    workspace: ptBrWorkspace,
    settings: ptBrSettings,
    permissions: ptBrPermissions,
    'advisor-network': ptBrAdvisorNetwork,
    'advisory/recommendations': ptBrAdvisoryRecommendations,
    'advisory/insights': ptBrAdvisoryInsights,
    'advisory/actions': ptBrAdvisoryActions,
    nonprofit: ptBrNonprofit,
    enterprise: ptBrEnterprise,
    'advisor-partner': ptBrAdvisorPartner
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
    'showcases/governance': enUsShowcasesGovernance,
    'intelligence-center': enUsIntelligenceCenter,
    'diagnostic': enUsAssessment,
    workspace: enUsWorkspace,
    settings: enUsSettings,
    permissions: enUsPermissions,
    'advisor-network': enUsAdvisorNetwork,
    'advisory/recommendations': enUsAdvisoryRecommendations,
    'advisory/insights': enUsAdvisoryInsights,
    'advisory/actions': enUsAdvisoryActions,
    nonprofit: enUsNonprofit,
    enterprise: enUsEnterprise,
    'advisor-partner': enUsAdvisorPartner
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
    'showcases/governance': esEsShowcasesGovernance,
    'intelligence-center': esEsIntelligenceCenter,
    'diagnostic': esEsAssessment,
    workspace: esEsWorkspace,
    settings: esEsSettings,
    permissions: esEsPermissions,
    'advisor-network': esEsAdvisorNetwork,
    'advisory/recommendations': esEsAdvisoryRecommendations,
    'advisory/insights': esEsAdvisoryInsights,
    'advisory/actions': esEsAdvisoryActions,
    nonprofit: esEsNonprofit,
    enterprise: esEsEnterprise,
    'advisor-partner': esEsAdvisorPartner
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
      'showcases/executive-command', 'showcases/systemic-intelligence', 'showcases/governance', 'intelligence-center', 'diagnostic', 'workspace', 'settings', 'permissions', 'advisor-network',
      'advisory/recommendations', 'advisory/insights', 'advisory/actions', 'nonprofit', 'enterprise', 'advisor-partner'
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
