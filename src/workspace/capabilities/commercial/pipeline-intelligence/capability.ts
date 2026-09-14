import { ExecutiveCapability } from '../../contracts/capability.types';

export const PipelineIntelligenceCapabilityDefinition: ExecutiveCapability = {
  id: 'commercial.pipeline-governance',
  office: 'commercial',
  surfaces: ['pipeline-governance'],
  requiredPermissions: ['commercial:read:pipeline'],
  intelligenceSources: ['enterprise:commercial:pipeline']
};
