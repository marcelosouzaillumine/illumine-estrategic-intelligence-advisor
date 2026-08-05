export interface AIProviderCapability {
  provider: string;
  model: string;
  capabilities: {
    reasoning: boolean;
    classification: boolean;
    summarization: boolean;
    extraction: boolean;
  };
  dataClassificationAllowed: ("public" | "internal" | "confidential" | "restricted")[];
  domains: ("commercial" | "financial" | "governance" | "risk" | "people" | "strategic")[];
  requiresHumanApproval: boolean;
}

export class AIProviderCapabilityRegistry {
  private capabilities: AIProviderCapability[] = [
    {
      provider: "openai",
      model: "gpt-4-enterprise",
      capabilities: { reasoning: true, classification: true, summarization: true, extraction: true },
      dataClassificationAllowed: ["public", "internal", "confidential"],
      domains: ["commercial", "financial", "governance", "risk", "strategic"],
      requiresHumanApproval: true // Enterprise OpenAI still requires human approval for sensitive domains
    }
  ];

  getCapability(provider: string, model: string): AIProviderCapability | undefined {
    return this.capabilities.find(c => c.provider === provider && c.model === model);
  }
}
