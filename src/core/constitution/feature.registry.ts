import { Feature } from './types';

export const FEATURES: Record<string, Feature> = {
  'platform.revenue.forecast': {
    id: 'platform.revenue.forecast',
    namespace: 'platform.revenue.forecast',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'feature.platform.revenue.forecast.title',
    capabilityModel: ['View', 'Edit', 'Export', 'AI'],
    intelligence: {
      knowledgeInputs: ['CRM', 'Pipeline', 'Billing'],
      knowledgeOutputs: ['Revenue Forecast', 'Expansion Score'],
      knowledgeProviders: ['Revenue Operations'],
      knowledgeConsumers: ['Forecast Agent', 'Revenue Agent'],
      constraints: ['requires authentication', 'tenant isolated']
    }
  },
  'platform.revenue.pipeline': {
    id: 'platform.revenue.pipeline',
    namespace: 'platform.revenue.pipeline',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'feature.platform.revenue.pipeline.title',
    capabilityModel: ['View', 'Edit', 'AI'],
    intelligence: {
      knowledgeInputs: ['CRM', 'Pipeline'],
      knowledgeOutputs: ['Pipeline Health', 'Active Deals'],
      knowledgeProviders: ['Revenue Operations'],
      knowledgeConsumers: ['Sales Agent'],
      constraints: ['requires authentication', 'tenant isolated']
    }
  },
  'platform.partners.network': {
    id: 'platform.partners.network',
    namespace: 'platform.partners.network',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'feature.platform.partners.network.title',
    capabilityModel: ['View', 'Edit', 'Admin'],
    intelligence: {
      knowledgeInputs: ['Partner Registry'],
      knowledgeOutputs: ['Active Partners'],
      knowledgeConsumers: ['Partner Agent']
    }
  }
};
