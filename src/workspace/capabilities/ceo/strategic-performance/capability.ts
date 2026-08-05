import { ExecutiveCapability } from '../../contracts/capability.types';

export const StrategicPerformanceCapabilityDefinition: ExecutiveCapability = {
  id: 'ceo.strategic-performance',
  office: 'ceo',
  surfaces: ['strategic-performance'],
  requiredPermissions: ['ceo:read:strategy'],
  intelligenceSources: ['enterprise:ceo:strategy']
};
