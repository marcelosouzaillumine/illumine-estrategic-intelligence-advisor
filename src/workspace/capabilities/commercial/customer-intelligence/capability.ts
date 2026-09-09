import { ExecutiveCapability } from '../../contracts/capability.types';

export const CustomerIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.customer-governance',
  office: 'commercial',
  surfaces: ['customer-governance'],
  requiredPermissions: ['commercial:read:customer'],
  intelligenceSources: ['enterprise:commercial:customer']
};
