export interface AIUsageRecord {
  tenantId: string;
  provider: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costEstimate: number;
  purpose: string; // e.g. 'conversation_signal_extraction'
  artifactGenerated?: string; // Links back to the IntelligenceArtifact ID if applicable
  createdAt: Date;
}
