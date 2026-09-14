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
      'growth-governance',
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
      'pipeline-governance',
      'customer-governance'
    ]
  },
  {
    office: 'people',
    capabilities: [
      'workforce-governance',
      'culture-engagement',
      'leadership-governance',
      'people-costs'
    ]
  },
  {
    office: 'risk',
    capabilities: [
      'enterprise-risk',
      'compliance-governance',
      'control-maturity'
    ]
  },
  {
    office: 'governance',
    capabilities: [
      'strategic-alignment',
      'decision-governance',
      'board-governance'
    ]
  },
  {
    office: 'innovation',
    capabilities: [
      'innovation-portfolio',
      'opportunity-governance',
      'experiment-management'
    ]
  }
];

export function getCapabilitiesByOffice(office: ExecutiveOffice): string[] {
  const registry = EnterpriseIntelligenceRegistry.find(r => r.office === office);
  return registry ? registry.capabilities : [];
}
