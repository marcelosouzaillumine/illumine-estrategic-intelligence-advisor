import { ExplainabilityNode } from "./ExplainabilityNode";

export interface ExplainabilitySummary {
  primaryDrivers: ExplainabilityNode[];
  secondaryDrivers: ExplainabilityNode[];
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  explanationText: string;
}
