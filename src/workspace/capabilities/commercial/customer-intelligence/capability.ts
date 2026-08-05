import { ExecutiveCapability } from '../../contracts/capability.types';

export const CustomerIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.customer-intelligence',
  office: 'commercial',
  surfaces: ['customer-intelligence'],
  requiredPermissions: ['commercial:read:customer'],
  intelligenceSources: ['enterprise:commercial:customer']
};
