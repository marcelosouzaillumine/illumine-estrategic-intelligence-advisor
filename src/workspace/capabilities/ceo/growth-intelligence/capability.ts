import { ExecutiveCapability } from '../../contracts/capability.types';

export const GrowthIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'ceo.growth-governance',
  office: 'ceo',
  surfaces: ['growth-governance'],
  requiredPermissions: ['ceo:read:growth'],
  intelligenceSources: ['enterprise:ceo:growth']
};
