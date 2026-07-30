export interface DomainCertifiedDatasetRegistryEntry {
  readonly domain: 'FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'RISK';
  readonly datasetName: string;
  readonly capabilityName: string;
  readonly governanceBoundaryService: string;
  readonly status: 'CERTIFIED' | 'PLANNED';
}

export class DomainCertifiedDatasetRegistry {
  private static readonly registry: readonly DomainCertifiedDatasetRegistryEntry[] = [
    {
      domain: 'FINANCIAL',
      datasetName: 'CertifiedFinancialDataset',
      capabilityName: 'Financial Governance Capability (CFDI v2.1)',
      governanceBoundaryService: 'FinancialGovernanceBoundary',
      status: 'CERTIFIED'
    },
    {
      domain: 'COMMERCIAL',
      datasetName: 'CertifiedCommercialDataset',
      capabilityName: 'Commercial Governance Capability',
      governanceBoundaryService: 'CommercialGovernanceBoundary',
      status: 'PLANNED'
    },
    {
      domain: 'OPERATIONAL',
      datasetName: 'CertifiedOperationalDataset',
      capabilityName: 'Operational Governance Capability',
      governanceBoundaryService: 'OperationalGovernanceBoundary',
      status: 'PLANNED'
    },
    {
      domain: 'PEOPLE',
      datasetName: 'CertifiedPeopleDataset',
      capabilityName: 'People Governance Capability',
      governanceBoundaryService: 'PeopleGovernanceBoundary',
      status: 'PLANNED'
    },
    {
      domain: 'RISK',
      datasetName: 'CertifiedRiskDataset',
      capabilityName: 'Risk Governance Capability',
      governanceBoundaryService: 'RiskGovernanceBoundary',
      status: 'PLANNED'
    }
  ];

  public static getEntries(): readonly DomainCertifiedDatasetRegistryEntry[] {
    return this.registry;
  }

  public static getEntryForDomain(domain: string): DomainCertifiedDatasetRegistryEntry | undefined {
    return this.registry.find(e => e.domain === domain);
  }
}
