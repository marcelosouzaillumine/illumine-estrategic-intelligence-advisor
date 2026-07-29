import { CapabilityManifest } from './capability-manifest';

export class CapabilityRegistry {
  private capabilities = new Map<string, CapabilityManifest>();

  constructor() {
    this.registerStandardCapabilities();
  }

  private registerStandardCapabilities(): void {
    this.register({
      name: 'finance-intelligence',
      version: '1.0.0',
      domain: 'finance',
      features: ['dre-analysis', 'cash-flow', 'profitability', 'forecasting'],
      permissions: ['finance.read', 'finance.manage']
    });

    this.register({
      name: 'governance-intelligence',
      version: '1.0.0',
      domain: 'governance',
      features: ['risk-management', 'compliance-audit', 'board-reports'],
      permissions: ['governance.read', 'governance.manage']
    });
  }

  public register(manifest: CapabilityManifest): void {
    this.capabilities.set(manifest.name, manifest);
  }

  public getCapability(name: string): CapabilityManifest | undefined {
    return this.capabilities.get(name);
  }

  public listCapabilities(): CapabilityManifest[] {
    return Array.from(this.capabilities.values());
  }
}

export const capabilityRegistry = new CapabilityRegistry();
