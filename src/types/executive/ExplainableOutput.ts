export interface ExplainableOutput<T> {
  payload: T;
  evidenceBundleId?: string;
  explainabilityChainId?: string;
  confidenceLevel: "UNVERIFIED" | "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
}
