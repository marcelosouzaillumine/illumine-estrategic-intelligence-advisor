import { useState, useEffect } from 'react';
import { 
  NavigationExperienceMode, 
  ShellType, 
  NAVIGATION_ROLLOUT_CONFIG 
} from './navigation-rollout.config';

export interface NavigationExperienceDecision {
  mode: NavigationExperienceMode;
  shell: ShellType;
  allowedOffices: string[];
  reason: string;
}

/**
 * Resolves the final navigation experience for the current session.
 * In a real application, this would take `user`, `tenantId`, and `capabilities` as arguments.
 */
export function resolveNavigationExperience(tenantId: string | null = null): NavigationExperienceDecision {
  const config = NAVIGATION_ROLLOUT_CONFIG;
  
  // 1. Check if executive access is enabled at all
  if (config.executiveAccess.strategy === 'tenant') {
    // Determine the active tenant
    const activeTenantId = tenantId || localStorage.getItem('tenantId') || 'default';
    
    // Check if this tenant has a specific rollout config
    const tenantConfig = config.executiveAccess.tenants.find(t => t.id === activeTenantId);
    
    if (tenantConfig) {
      // Determine shell based on mode
      const shell: ShellType = (tenantConfig.mode === 'executive' || tenantConfig.mode === 'hybrid') 
        ? 'executive' 
        : 'legacy';

      return {
        mode: tenantConfig.mode,
        shell,
        allowedOffices: tenantConfig.offices || [],
        reason: `tenant-config-match:${activeTenantId}`
      };
    }
  }

  // 2. Default Fallback
  return {
    mode: config.defaultMode,
    shell: config.defaultMode === 'legacy' ? 'legacy' : 'executive',
    allowedOffices: [],
    reason: 'default-fallback'
  };
}

/**
 * React Hook for consuming the experience decision
 */
export function useNavigationExperience(): NavigationExperienceDecision {
  const [decision, setDecision] = useState<NavigationExperienceDecision>(() => {
    // Hardcode 'internal' tenant for local testing to force the hybrid mode, 
    // unless a local override exists.
    const override = localStorage.getItem('tenantId');
    return resolveNavigationExperience(override || 'internal');
  });

  // Listen for storage events in case tenantId changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tenantId') {
        setDecision(resolveNavigationExperience(e.newValue || 'internal'));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return decision;
}
