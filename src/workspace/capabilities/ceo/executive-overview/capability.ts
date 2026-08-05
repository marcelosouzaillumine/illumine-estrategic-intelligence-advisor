import { ExecutiveCapability } from '../../contracts/capability.types';

export const ExecutiveOverviewCapabilityDefinition: ExecutiveCapability = {
  id: 'ceo.executive-overview',
  office: 'ceo',
  surfaces: ['executive-overview'],
  requiredPermissions: ['ceo:read:overview'],
  intelligenceSources: ['enterprise:ceo:summary']
};
