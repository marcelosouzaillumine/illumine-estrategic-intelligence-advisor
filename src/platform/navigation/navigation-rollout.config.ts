export type NavigationExperienceMode = 'legacy' | 'hybrid' | 'executive';
export type ShellType = 'legacy' | 'executive';

export interface TenantRolloutConfig {
  id: string;
  mode: NavigationExperienceMode;
  offices: string[];
  surfaces?: Record<string, string[]>;
}

export interface ExecutiveAccessStrategy {
  strategy: 'tenant' | 'global';
  tenants: TenantRolloutConfig[];
}

export interface NavigationRolloutConfig {
  defaultMode: NavigationExperienceMode;
  executiveAccess: ExecutiveAccessStrategy;
}

export const NAVIGATION_ROLLOUT_CONFIG: NavigationRolloutConfig = {
  defaultMode: 'legacy',
  executiveAccess: {
    strategy: 'tenant',
    tenants: [
      {
        id: 'internal',
        mode: 'executive',
        offices: ['cfo-office'],
        surfaces: {
          'cfo-office': ['nav-finance-dre', 'nav-finance-cash', 'nav-finance-modeling']
        }
      }
    ]
  }
};
