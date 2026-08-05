import { ExecutiveCapability } from '../../contracts/capability.types';

export const CommercialPerformanceCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.commercial-performance',
  office: 'commercial',
  surfaces: ['commercial-performance'],
  requiredPermissions: ['commercial:read:performance'],
  intelligenceSources: ['enterprise:commercial:performance']
};
