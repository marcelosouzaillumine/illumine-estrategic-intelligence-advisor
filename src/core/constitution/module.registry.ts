import { Module } from './types';

export const MODULES: Record<string, Module> = {
  'platform.revenue': {
    id: 'platform.revenue',
    namespace: 'platform.revenue',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'workspace.platform.revenue.title',
    descriptionKey: 'workspace.platform.revenue.description',
    features: ['platform.revenue.forecast', 'platform.revenue.pipeline']
  },
  'platform.partners': {
    id: 'platform.partners',
    namespace: 'platform.partners',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'workspace.platform.partners.title',
    descriptionKey: 'workspace.platform.partners.description',
    features: ['platform.partners.network']
  }
};
