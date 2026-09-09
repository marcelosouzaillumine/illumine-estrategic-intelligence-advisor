import { DiagnosticDomain } from './diagnostic-types';

export interface DomainMetadata {
  domain: DiagnosticDomain;
  name: string;
  isCoreFoundation: boolean;
  supportedEngines: string[];
}

export class DomainRegistry {
  private static instance: DomainRegistry;
  private domains: Map<DiagnosticDomain, DomainMetadata> = new Map();

  private constructor() {
    this.registerCoreDomains();
  }

  public static getInstance(): DomainRegistry {
    if (!DomainRegistry.instance) {
      DomainRegistry.instance = new DomainRegistry();
    }
    return DomainRegistry.instance;
  }

  private registerCoreDomains() {
    this.register({
      domain: 'financial',
      name: 'Financial Governance™',
      isCoreFoundation: true,
      supportedEngines: ['Diagnostic', 'ERP Connector', 'KPI Engine']
    });

    this.register({
      domain: 'governance',
      name: 'Governance Governance™',
      isCoreFoundation: true,
      supportedEngines: ['Diagnostic', 'Advisory', 'Compliance Engine']
    });

    this.register({
      domain: 'operational',
      name: 'Operational Governance™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });
    
    this.register({
      domain: 'commercial',
      name: 'Commercial Governance™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });

    this.register({
      domain: 'people',
      name: 'People Governance™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });
    
    this.register({
      domain: 'sample',
      name: 'Sample Governance™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });
  }

  public register(metadata: DomainMetadata) {
    this.domains.set(metadata.domain, metadata);
  }

  public unregister(domain: DiagnosticDomain): void {
    this.domains.delete(domain);
  }

  public getDomain(domain: DiagnosticDomain): DomainMetadata | undefined {
    return this.domains.get(domain);
  }

  public getAllDomains(): DomainMetadata[] {
    return Array.from(this.domains.values());
  }

  public getCoreFoundations(): DomainMetadata[] {
    return this.getAllDomains().filter(d => d.isCoreFoundation);
  }
}
