export interface EntityReference {
  type: string;
  id: string;
}

export interface IntelligenceInput {
  sourceType: "conversation" | "document" | "financial_data" | "event";
  content: string; // The raw data or prompt to analyze
  relatedEntities: EntityReference[];
  requestedArtifact: "signal" | "insight" | "recommendation";
}
