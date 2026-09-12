import { WorkspaceCacheBoundary } from './WorkspaceCacheBoundary';

export type InvalidationTrigger = 
  | 'WORKSPACE_SWITCH'
  | 'TENANT_SWITCH'
  | 'LOGOUT'
  | 'CRITICAL_VIOLATION'
  | 'IDLE_TIMEOUT'
  | 'MANUAL_REFRESH'
  | 'ISOLATION_ERROR'
  | 'PERMISSION_CHANGE';

export class CacheInvalidationEngine {
  static handleTrigger(trigger: InvalidationTrigger, currentWorkspaceId: string | null) {
    switch (trigger) {
      case 'WORKSPACE_SWITCH':
      case 'TENANT_SWITCH':
      case 'ISOLATION_ERROR':
      case 'CRITICAL_VIOLATION':
      case 'PERMISSION_CHANGE':
        if (currentWorkspaceId) {
          WorkspaceCacheBoundary.purgeOnSwitch(currentWorkspaceId, 'NONE');
        } else {
          WorkspaceCacheBoundary.purgeOnLogout();
        }
        break;
      
      case 'LOGOUT':
      case 'IDLE_TIMEOUT':
        WorkspaceCacheBoundary.purgeOnLogout();
        break;

      case 'MANUAL_REFRESH':
        if (currentWorkspaceId) {
          WorkspaceCacheBoundary.purgeOnSwitch(currentWorkspaceId, currentWorkspaceId);
        }
        break;
    }
  }
}
