import { ExecutiveCapability } from '../../contracts/capability.types';

export const PipelineIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.pipeline-intelligence',
  office: 'commercial',
  surfaces: ['pipeline-intelligence'],
  requiredPermissions: ['commercial:read:pipeline'],
  intelligenceSources: ['enterprise:commercial:pipeline']
};
