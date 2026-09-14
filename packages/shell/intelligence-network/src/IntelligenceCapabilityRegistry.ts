import { IntelligenceCapabilityDescriptor } from '@illumine/executive-contracts';

export class IntelligenceCapabilityRegistry {
  private static readonly capabilities: IntelligenceCapabilityDescriptor[] = [
    {
      capabilityId: 'cap-eail-01',
      name: 'Executive Advisory Governance Layer (EAIL v1.0)',
      version: '1.0.0',
      owner: 'Executive Advisory Council',
      supportedDomains: ['FINANCIAL', 'STRATEGIC'],
      priority: 10,
      confidenceScore: 98.2,
      expectedLatencyMs: 45,
      isHealthy: true
    },
    {
      capabilityId: 'cap-ewi-01',
      name: 'Executive Workflow Governance (EWI v1.0)',
      version: '1.0.0',
      owner: 'Workflow Governance Board',
      supportedDomains: ['OPERATIONAL', 'FINANCIAL'],
      priority: 8,
      confidenceScore: 99.1,
      expectedLatencyMs: 30,
      isHealthy: true
    }
  ];

  public static getRegisteredCapabilities(): readonly IntelligenceCapabilityDescriptor[] {
    return this.capabilities;
  }

  public static resolveCapabilityForDomain(domain: string): IntelligenceCapabilityDescriptor | undefined {
    return this.capabilities.find(c => c.supportedDomains.includes(domain) && c.isHealthy);
  }
}
