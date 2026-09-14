import { ExecutiveCapability } from '../../contracts/capability.types';

export const financialPerformanceCapability: ExecutiveCapability = {
  id: 'cfo.financial-performance',
  office: 'cfo',
  surfaces: [
    'performance.revenue',
    'performance.ebitda',
    'performance.margins'
  ],
  requiredPermissions: ['view_financial_performance'],
  intelligenceSources: ['enterprise:financial', 'cfo:governance-engine']
};
