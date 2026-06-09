export interface ExplainabilityNode {
  nodeId: string;
  nodeType: "PRIMARY_DRIVER" | "SECONDARY_DRIVER" | "MITIGATING_FACTOR" | "AGGRAVATING_FACTOR" | "CONSTITUTIONAL_AXIOM";
  title: string;
  description: string;
  impactDirection: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "BLOCKING";
  impactWeight: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidenceReferenceIds?: string[];
}
