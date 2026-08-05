import { WorkspaceDefinition } from '../types';
import { FINANCIAL_PERFORMANCE_SURFACE } from '../surfaces/finance/performance.surface';
import { CAPABILITIES } from '../../domain/authorization/Capabilities';

export const CFO_WORKSPACE: WorkspaceDefinition = {
  officeId: 'cfo-office',
  titleKey: 'workspace.cfo.title',
  subtitleKey: 'workspace.cfo.subtitle',
  iconKey: 'financial-chart',
  defaultSurface: 'financial-performance',
  capabilities: [CAPABILITIES.FINANCIAL_DASHBOARD_VIEW],
  supportedAgents: ['FinancialAnalystAgent', 'ExecutiveAdvisorAgent'],
  maturity: 'prototype',
  surfaces: [
    FINANCIAL_PERFORMANCE_SURFACE
  ]
};
