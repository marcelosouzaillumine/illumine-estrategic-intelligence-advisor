export type DiagnosticDomain =
  | "financial"
  | "governance"
  | "operational"
  | "commercial"
  | "people"
  | "innovation"
  | "risk"
  | "institutional"
  | "executive360"
  | "mission"
  | "digital"
  | "customer"
  | "sustainability"
  | "ai"
  | "sample";

export type DiagnosticDataSource = "diagnostic-v1" | "erp-connector" | "advisory-validation" | "questionnaire" | "financial-engine" | "erp-integration" | "advisor-input";

export type MaturityLevel =
  | "initial"
  | "developing"
  | "structured"
  | "advanced"
  | "excellence";

export interface DiagnosticResponse {
  questionId: string;
  selectedOptionId: string;
  timestamp: string;
}

export interface DiagnosticExecutionContext {
  userId?: string;
  organizationId?: string;
  journeyId: string;
  responses: DiagnosticResponse[];
  source: "concierge" | "advisory" | "workspace" | "agent";
}
