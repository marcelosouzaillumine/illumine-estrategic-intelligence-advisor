export interface EvidenceReference {
  evidenceId: string;
  evidenceType: "DOCUMENT" | "INDICATOR" | "AXIOM" | "EXTERNAL_DATA" | "USER_INPUT";
  sourceId: string;
  sourceName: string;
  sourceCategory: string;
  timestamp: string;
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  
  // Traceability integration
  correlationId?: string;
  lineageId?: string;
}
