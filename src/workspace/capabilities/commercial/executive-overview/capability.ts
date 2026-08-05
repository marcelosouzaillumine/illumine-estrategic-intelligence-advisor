import { ExecutiveCapability } from '../../contracts/capability.types';

export const CommercialOverviewCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.executive-overview',
  office: 'commercial',
  surfaces: ['executive-overview'],
  requiredPermissions: ['commercial:read:overview'],
  intelligenceSources: ['enterprise:commercial:summary']
};
