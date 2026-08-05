export interface IntelligenceCapability {
  id: string;
  name: string;
  layer: 'INTELLIGENCE' | 'EXPERIENCE' | 'DATA' | 'INSTITUTIONAL';
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
  id: "financial.balance_sheet_intelligence",
  name: "Balance Sheet Intelligence™",
  layer: "INTELLIGENCE",
  version: "1.0",
  owner: "Financial Capability"
});

CapabilityRegistry.register({
  id: "financial.intelligence.assurance",
  name: "Financial Intelligence Assurance Layer™",
  layer: "INTELLIGENCE",
  version: "1.0",
  owner: "Financial Capability"
});
