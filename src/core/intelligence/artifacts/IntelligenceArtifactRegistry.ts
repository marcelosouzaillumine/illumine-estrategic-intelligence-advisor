export type ArtifactLifecycle = "detected" | "validated" | "approved" | "executed" | "measured" | "learned";

export interface IntelligenceArtifactDefinition {
  type: string; // e.g. 'FinancialRiskSignal'
  version: string; // e.g. '1.0'
  domain: "financial" | "commercial" | "governance" | "risk" | "operational" | "people" | "institutional" | "strategic";
  producer: string; // e.g. 'executive.conversation.intelligence'
  consumers: string[]; // Capabilities that listen to this artifact
  lifecycleSupported: ArtifactLifecycle[];
  status: "active" | "deprecated" | "experimental";
  createdAt: Date;
}

export interface IntelligenceArtifactRegistry {
  register(definition: IntelligenceArtifactDefinition): void;
  getDefinition(type: string, version: string): IntelligenceArtifactDefinition | undefined;
  listActive(): IntelligenceArtifactDefinition[];
}
