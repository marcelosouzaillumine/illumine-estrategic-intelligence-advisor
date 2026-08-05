export interface KnowledgeArtifact {
  id: string;
  tenantId: string;
  type: "document" | "meeting" | "decision" | "conversation" | "financial_record" | "policy" | "metric";
  title: string;
  contentReference?: string; // e.g. URL to original PDF or blob storage key
  sourceId: string;
  domain: "financial" | "commercial" | "governance" | "risk" | "operational" | "people" | "strategic";
  confidentiality: "public" | "internal" | "confidential" | "restricted";
  version: number;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
