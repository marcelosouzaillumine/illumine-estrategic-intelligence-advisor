export interface KnowledgeValidationIssue {
  code: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface KnowledgeIngestionResult {
  success: boolean;
  artifactId?: string; // Present if validation passes and artifact is generated
  status: "captured" | "normalized" | "validated" | "published" | "rejected";
  validationIssues: KnowledgeValidationIssue[];
  lineageId: string; // The trace ID linking this ingestion attempt
  createdAt: Date;
}
