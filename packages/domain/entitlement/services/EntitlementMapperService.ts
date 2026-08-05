import { Capability, CapabilityCategory, UsageLimit, FeatureGate } from '../value-objects/EntitlementValueObjects';

export interface CommercialScope {
  capabilities: string[];
  modules: string[];
}

export interface CommercialCapacity {
  seats: number;
  environments: number;
  storageLimitGB?: number;
}

export class EntitlementMapperService {
  /**
   * Pure Domain Service: Maps a generic commercial license descriptor into concrete technical capabilities.
   * In a real enterprise system, this would likely cross-reference an in-memory configuration map,
   * but it NEVER accesses a database or UI.
   */
  public mapCapabilities(scope: CommercialScope): Capability[] {
    const mapped: Capability[] = [];

    // Example logic mapping commercial modules to specific technical capabilities
    if (scope.modules.includes('ILLUMINE_EXECUTIVE') || scope.capabilities.includes('executive_dashboard')) {
      mapped.push({ code: 'executive_dashboard', category: CapabilityCategory.INTELLIGENCE });
      mapped.push({ code: 'financial_intelligence', category: CapabilityCategory.INTELLIGENCE });
      mapped.push({ code: 'governance_office', category: CapabilityCategory.GOVERNANCE });
      mapped.push({ code: 'risk_office', category: CapabilityCategory.OPERATIONS });
    }

    if (scope.modules.includes('ILLUMINE_START')) {
      mapped.push({ code: 'basic_dashboard', category: CapabilityCategory.PLATFORM });
    }

    return mapped;
  }

  public mapLimits(capacity: CommercialCapacity): UsageLimit[] {
    return [
      { metricCode: 'MAX_USERS', maxLimit: capacity.seats },
      { metricCode: 'MAX_ENVIRONMENTS', maxLimit: capacity.environments },
      { metricCode: 'MAX_STORAGE_GB', maxLimit: capacity.storageLimitGB || 10 }
    ];
  }

  public mapFeatureGates(scope: CommercialScope): FeatureGate[] {
    return [
      { gateCode: 'BETA_AI_ADVISOR', isEnabled: scope.modules.includes('BETA_OPT_IN') }
    ];
  }
}
