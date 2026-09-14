export interface ArchitectureObservation {
  id: string;
  artifactId: string;
  category: "DEPENDENCY" | "BOUNDARY" | "COMPLEXITY" | "COHESION" | "STRUCTURE";
  metric: string;
  value: number;
  sourceSnapshot: {
    id: string;
    generatedAt: string;
    gitCommit: string;
  };
  generatedBy: string;
}
