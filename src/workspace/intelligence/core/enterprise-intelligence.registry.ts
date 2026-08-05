import { ExecutiveOffice } from '../models/enterprise-insight.types';

export interface OfficeCapabilityRegistry {
  office: ExecutiveOffice;
  capabilities: string[];
}

export const EnterpriseIntelligenceRegistry: OfficeCapabilityRegistry[] = [
  {
    office: 'ceo',
    capabilities: [
      'strategic-performance',
      'growth-intelligence',
      'risk-overview'
    ]
  },
  {
    office: 'cfo',
    capabilities: [
      'working-capital',
      'financial-health',
      'cash-flow',
      'operational-expenses'
    ]
  },
  {
    office: 'coo',
    capabilities: [
      'operational-performance',
      'supply-chain',
      'process-efficiency'
    ]
  },
  {
    office: 'commercial',
    capabilities: [
      'commercial-performance',
      'pipeline-intelligence',
      'customer-intelligence'
    ]
  },
  {
    office: 'people',
    capabilities: [
      'workforce-intelligence',
      'culture-engagement',
      'leadership-intelligence',
      'people-costs'
    ]
  },
  {
    office: 'risk',
    capabilities: [
      'enterprise-risk',
      'compliance-intelligence',
      'control-maturity'
    ]
  },
  {
    office: 'governance',
    capabilities: [
      'strategic-alignment',
      'decision-intelligence',
      'board-intelligence'
    ]
  },
  {
    office: 'innovation',
    capabilities: [
      'innovation-portfolio',
      'opportunity-intelligence',
      'experiment-management'
    ]
  }
];

export function getCapabilitiesByOffice(office: ExecutiveOffice): string[] {
  const registry = EnterpriseIntelligenceRegistry.find(r => r.office === office);
  return registry ? registry.capabilities : [];
}
