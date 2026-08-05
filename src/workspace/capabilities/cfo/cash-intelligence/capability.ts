import { ExecutiveCapability } from '../../contracts/capability.types';

export const cashIntelligenceCapability: ExecutiveCapability = {
  id: 'cfo.cash-intelligence',
  office: 'cfo',
  surfaces: [
    'cash.liquidity',
    'cash.runway',
    'cash.free-cash-flow'
  ],
  requiredPermissions: ['view_cash_intelligence'],
  intelligenceSources: ['enterprise:financial', 'cfo:intelligence-engine']
};
