export interface LineageNode {
  id: string;
  type: "conversation" | "signal" | "insight" | "recommendation" | "decision" | "outcome" | "learning";
  referenceId: string;
}

export interface LineageEdge {
  fromNodeId: string;
  toNodeId: string;
  relationshipType: "generated" | "validated" | "approved" | "resulted_in";
}

export interface IntelligenceLineage {
  lineageId: string;
  nodes: LineageNode[];
  edges: LineageEdge[];
}
