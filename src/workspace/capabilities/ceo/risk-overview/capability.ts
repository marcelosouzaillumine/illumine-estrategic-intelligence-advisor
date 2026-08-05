import { ExecutiveCapability } from '../../contracts/capability.types';

export const RiskOverviewCapabilityDefinition: ExecutiveCapability = {
  id: 'ceo.risk-overview',
  office: 'ceo',
  surfaces: ['risk-overview'],
  requiredPermissions: ['ceo:read:risks'],
  intelligenceSources: ['enterprise:ceo:risk']
};
