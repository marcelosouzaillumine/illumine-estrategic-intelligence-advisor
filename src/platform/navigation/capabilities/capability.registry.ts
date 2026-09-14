import { CAPABILITIES, SystemCapability } from '../../../domain/authorization/Capabilities';
import { CapabilityRegistryEntry } from '../../../navigation/types';

export const CAPABILITY_REGISTRY: Record<SystemCapability, CapabilityRegistryEntry> = {
  [CAPABILITIES.FINANCIAL_DASHBOARD_VIEW]: {
    capability: CAPABILITIES.FINANCIAL_DASHBOARD_VIEW,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.performance',
    route: '/finance/dre'
  },
  [CAPABILITIES.FINANCIAL_ENTRIES_VIEW]: {
    capability: CAPABILITIES.FINANCIAL_ENTRIES_VIEW,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.cash',
    route: '/finance/cash-flow'
  },
  [CAPABILITIES.FINANCIAL_ENTRIES_IMPORT]: {
    capability: CAPABILITIES.FINANCIAL_ENTRIES_IMPORT,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.import',
    route: '/finance/dre'
  },
  [CAPABILITIES.FINANCIAL_BUDGET_MANAGE]: {
    capability: CAPABILITIES.FINANCIAL_BUDGET_MANAGE,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.planning',
    route: '/finance/modeling'
  },
  [CAPABILITIES.BOARD_PACK_VIEW]: {
    capability: CAPABILITIES.BOARD_PACK_VIEW,
    officeId: 'board-office',
    engineKey: 'engine.board.governance',
    route: '/governance/board'
  },
  [CAPABILITIES.BOARD_DECISION_APPROVE]: {
    capability: CAPABILITIES.BOARD_DECISION_APPROVE,
    officeId: 'board-office',
    engineKey: 'engine.decision.governance',
    route: '/governance/board'
  },
  [CAPABILITIES.SIMULATION_CREATE]: {
    capability: CAPABILITIES.SIMULATION_CREATE,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.scenario',
    route: '/governance/simulator'
  },
  [CAPABILITIES.SIMULATION_VIEW]: {
    capability: CAPABILITIES.SIMULATION_VIEW,
    officeId: 'cfo-office',
    engineKey: 'engine.financial.scenario',
    route: '/governance/simulator'
  },
  [CAPABILITIES.TENANT_MANAGE]: {
    capability: CAPABILITIES.TENANT_MANAGE,
    officeId: 'advisor-office',
    engineKey: 'engine.client.governance',
    route: '/admin/settings'
  },
  [CAPABILITIES.USER_MANAGE]: {
    capability: CAPABILITIES.USER_MANAGE,
    officeId: 'risk-office',
    engineKey: 'engine.control.governance',
    route: '/admin/users'
  },
  [CAPABILITIES.SYSTEM_OBSERVABILITY_VIEW]: {
    capability: CAPABILITIES.SYSTEM_OBSERVABILITY_VIEW,
    officeId: 'ceo-office',
    engineKey: 'engine.institutional.performance',
    route: '/admin/settings'
  },
  [CAPABILITIES.SYSTEM_ADMINISTRATION]: {
    capability: CAPABILITIES.SYSTEM_ADMINISTRATION,
    officeId: 'risk-office',
    engineKey: 'engine.compliance.governance',
    route: '/admin/settings'
  },
  [CAPABILITIES.SYSTEM_INTELLIGENCE_DEBUG]: {
    capability: CAPABILITIES.SYSTEM_INTELLIGENCE_DEBUG,
    officeId: 'risk-office', // Or a new system office
    engineKey: 'engine.system.governance',
    route: '/executive/lab/cfo-validation'
  },
  [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW]: {
    capability: CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW,
    officeId: 'ceo-office',
    engineKey: 'engine.institutional.performance',
    route: '/workspace'
  },
  [CAPABILITIES.EXECUTIVE_WORKSPACE_ACCESS]: {
    capability: CAPABILITIES.EXECUTIVE_WORKSPACE_ACCESS,
    officeId: 'ceo-office',
    engineKey: 'engine.institutional.performance',
    route: '/executive'
  }
};
