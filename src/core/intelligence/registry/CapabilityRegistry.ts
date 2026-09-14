export interface IntelligenceCapability {
  id: string;
  name: string;
  layer: 'GOVERNANCE' | 'EXPERIENCE' | 'DATA' | 'INSTITUTIONAL';
  version: string;
  owner: string;
}

class Registry {
  private capabilities: Map<string, IntelligenceCapability> = new Map();

  register(capability: IntelligenceCapability) {
    this.capabilities.set(capability.id, capability);
    console.log(`[CapabilityRegistry] Registered: ${capability.id}`);
  }

  get(id: string): IntelligenceCapability | undefined {
    return this.capabilities.get(id);
  }

  getAll(): IntelligenceCapability[] {
    return Array.from(this.capabilities.values());
  }
}

export const CapabilityRegistry = new Registry();

// Register foundational capabilities
CapabilityRegistry.register({
  id: "financial.balance_sheet_governance",
  name: "Balance Sheet Governance™",
  layer: "GOVERNANCE",
  version: "1.0",
  owner: "Financial Capability"
});

CapabilityRegistry.register({
  id: "financial.governance.assurance",
  name: "Financial Governance Assurance Layer™",
  layer: "GOVERNANCE",
  version: "1.0",
  owner: "Financial Capability"
});
