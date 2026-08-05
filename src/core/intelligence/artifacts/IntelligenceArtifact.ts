export interface EvidenceReference {
  type: "message" | "document_snippet" | "financial_record" | "sensor_log";
  referenceId: string;
  excerpt?: string;
}

export interface IntelligenceArtifact {
  id: string;
  tenantId: string;
  source: "conversation" | "meeting" | "document" | "financial_data" | "external_event";
  artifactType: "signal" | "insight" | "recommendation";
  domain: "financial" | "commercial" | "governance" | "risk" | "operational" | "people" | "institutional" | "strategic";
  confidence: { 
    score: number; 
    factors: string[]; 
  };
  evidence: EvidenceReference[];
  relatedEntities: { type: string; id: string }[];
  lifecycle: "detected" | "validated" | "approved" | "executed" | "measured" | "learned";
  createdAt: Date;
}
