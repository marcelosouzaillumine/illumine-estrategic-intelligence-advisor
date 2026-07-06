export type OverrideSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type FiduciaryDomain = 'PATRIMONIAL' | 'DFC' | 'DRE' | 'DLPA' | 'EFOS';

export interface FiduciaryOverride {
  id: string;
  name: string;
  domain: FiduciaryDomain;
  conditionMet: boolean;
  severity: OverrideSeverity;
  ceilingImpact?: 'VULNERABLE' | 'FRAGILE' | 'CRITICAL';
  penaltyScore: number; // 1 for VULNERABLE, 2 for FRAGILE, 3 for CRITICAL, etc.
  mandatoryDisclosure?: string;
  triggeredAt?: string;
}

export class FiduciaryOverrideRegistry {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  private static overrides: FiduciaryOverride[] = [];

  public static register(override: FiduciaryOverride) {
    const index = this.overrides.findIndex(o => o.id === override.id);
    if (index >= 0) {
      this.overrides[index] = override;
    } else {
      this.overrides.push(override);
    }
  }

  public static getActiveOverrides(domain?: FiduciaryDomain): FiduciaryOverride[] {
    return this.overrides.filter(o => o.conditionMet && (!domain || o.domain === domain));
  }
  
  public static getAll(domain?: FiduciaryDomain): FiduciaryOverride[] {
    return this.overrides.filter(o => !domain || o.domain === domain);
  }

  public static clear(domain?: FiduciaryDomain) {
    if (domain) {
      this.overrides = this.overrides.filter(o => o.domain !== domain);
    } else {
      this.overrides = [];
    }
  }
}
