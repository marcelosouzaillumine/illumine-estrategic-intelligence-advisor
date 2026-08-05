import { ExecutiveCapability } from '../../contracts/capability.types';

export const GrowthIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'ceo.growth-intelligence',
  office: 'ceo',
  surfaces: ['growth-intelligence'],
  requiredPermissions: ['ceo:read:growth'],
  intelligenceSources: ['enterprise:ceo:growth']
};
