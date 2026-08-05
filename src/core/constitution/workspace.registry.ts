import { Workspace } from './types';

export const WORKSPACES: Record<string, Workspace> = {
  platform: {
    id: 'platform',
    namespace: 'platform',
    version: '1.0.0',
    status: 'Active',
    owner: 'illumine.core',
    visibility: 'internal',
    stability: 'stable',
    introducedIn: 'Wave 17J.1.10',
    titleKey: 'workspace.platform.title',
    descriptionKey: 'workspace.platform.description',
    modules: ['platform.revenue', 'platform.partners']
  }
};
