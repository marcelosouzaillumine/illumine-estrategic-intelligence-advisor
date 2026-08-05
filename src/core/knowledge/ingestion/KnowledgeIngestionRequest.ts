export interface KnowledgeIngestionRequest {
  tenantId: string;
  source: "conversation" | "document" | "meeting" | "financial_data" | "external_system";
  payload: any; // Raw data to be ingested (e.g. Conversation object, text string, JSON)
  metadata: {
    createdBy: string;
    createdAt: Date;
    classification: string;
  };
}
