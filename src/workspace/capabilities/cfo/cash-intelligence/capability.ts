import { ExecutiveCapability } from '../../contracts/capability.types';

export const cashIntelligenceCapability: ExecutiveCapability = {
  id: 'cfo.cash-governance',
  office: 'cfo',
  surfaces: [
    'cash.liquidity',
    'cash.runway',
    'cash.free-cash-flow'
  ],
  requiredPermissions: ['view_cash_governance'],
  intelligenceSources: ['enterprise:financial', 'cfo:governance-engine']
};
