import { FeatureFlag } from './ProductGovernanceTypes';

export class FeatureFlagRegistry {
  private static readonly flags: Record<string, FeatureFlag> = {
    'BETA_NEW_UI_DASHBOARD': {
      flagId: 'BETA_NEW_UI_DASHBOARD',
      isEnabled: false,
      audience: 'BETA_ONLY'
    },
    'ENTERPRISE_CUSTOM_BRANDING': {
      flagId: 'ENTERPRISE_CUSTOM_BRANDING',
      isEnabled: true,
      audience: 'ENTERPRISE_ONLY'
    }
  };

  static isFlagEnabled(flagId: string, audienceLabel: string): boolean {
    const flag = this.flags[flagId];
    if (!flag || !flag.isEnabled) return false;

    if (flag.audience === 'ALL') return true;
    if (flag.audience === audienceLabel) return true;

    return false;
  }

  static getAllFlags(): FeatureFlag[] {
    return Object.values(this.flags);
  }
}
