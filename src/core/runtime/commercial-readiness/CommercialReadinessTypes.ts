export interface CommercialTier {
  tierId: string;
  name: 'ESSENTIAL' | 'ENTERPRISE' | 'ADVISOR_NETWORK';
  basePrice: number;
  features: string[];
}

export interface EnterpriseFeature {
  featureId: string;
  name: string;
  module: string;
  active: boolean;
}
