export interface EvaluationRule {
  id: string;
  category: "DEPENDENCY" | "BOUNDARY" | "COMPLEXITY" | "COHESION" | "STRUCTURE";
  metric: string;
  description: string;
  formula: string;
}
