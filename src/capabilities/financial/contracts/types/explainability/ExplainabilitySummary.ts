import { ExplainabilityNode } from "../../../../../types/explainability/ExplainabilityNode";

export interface ExplainabilitySummary {
  primaryDrivers: ExplainabilityNode[];
  secondaryDrivers: ExplainabilityNode[];
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  explanationText: string;
}
