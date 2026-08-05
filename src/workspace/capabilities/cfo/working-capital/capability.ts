import { ExecutiveCapability } from '../../contracts/capability.types';

export const WorkingCapitalCapabilityDefinition: ExecutiveCapability = {
  id: 'cfo.working-capital',
  office: 'cfo',
  surfaces: ['working-capital'],
  requiredPermissions: ['cfo:read:working-capital'],
  intelligenceSources: ['enterprise:cfo:working-capital']
};
