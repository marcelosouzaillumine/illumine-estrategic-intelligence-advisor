export interface EvidenceAwareOutput<T> {
  payload: T;
  
  // Fiduciary & Audit Fields
  evidenceBundleId?: string;
  evidenceCount: number;
  confidenceLevel: "UNVERIFIED" | "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  
  // Traceability Context
  correlationId?: string;
}
