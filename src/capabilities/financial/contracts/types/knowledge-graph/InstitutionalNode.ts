export type InstitutionalNodeType = 
  | "EVIDENCE" | "INDICATOR" | "DRIVER" | "RISK" 
  | "OPPORTUNITY" | "DECISION" | "RECOMMENDATION" 
  | "SCENARIO" | "CONSTITUTIONAL_RULE" | "STRATEGIC_OBJECTIVE" | "EVENT";

export interface InstitutionalNode {
  nodeId: string;
  nodeType: InstitutionalNodeType;
  title: string;
  description: string;
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  createdAt: string;
}
