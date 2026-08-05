import { ExecutiveCapability } from '../../contracts/capability.types';

export const planningForecastCapability: ExecutiveCapability = {
  id: 'cfo.planning-forecast',
  office: 'cfo',
  surfaces: [
    'planning.budget',
    'planning.forecast'
  ],
  requiredPermissions: ['view_planning_forecast'],
  intelligenceSources: ['enterprise:financial', 'cfo:intelligence-engine']
};
