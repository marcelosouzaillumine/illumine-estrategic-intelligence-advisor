import { CommercialTier } from './CommercialReadinessTypes';

export class InstitutionalOfferingRegistry {
  static getTiers(): CommercialTier[] {
    return [
      { tierId: 'T1', name: 'ESSENTIAL', basePrice: 5000, features: ['Fiduciary Core'] },
      { tierId: 'T2', name: 'ENTERPRISE', basePrice: 15000, features: ['Fiduciary Core', 'Early Warning', 'Simulation'] },
      { tierId: 'T3', name: 'ADVISOR_NETWORK', basePrice: 25000, features: ['Multi-tenant', 'White-label Reports'] }
    ];
  }
}
