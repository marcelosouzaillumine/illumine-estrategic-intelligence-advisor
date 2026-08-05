export interface GroundingTraceNode {
  step: "retrieval" | "candidate_set" | "filtering" | "ranking" | "budgeting" | "grounding" | "inference" | "artifact";
  inputCount?: number;
  outputCount?: number;
  discardedCount?: number;
  discardReasons?: Record<string, number>; // e.g. { "expired": 30, "confidential": 15 }
  executedAt: Date;
}

export interface GroundingTrace {
  id: string;
  sessionId: string;
  steps: GroundingTraceNode[];
  // Complete graph mapping how raw conversation -> signals -> retrieval -> final recommendation
  causalityGraph: any; 
}
