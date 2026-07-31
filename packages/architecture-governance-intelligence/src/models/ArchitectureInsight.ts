export type InsightInterpretation =
  | 'STRUCTURAL_CHANGE'
  | 'DEPENDENCY_EXPANSION'
  | 'BOUNDARY_CHANGE'
  | 'TOPOLOGY_CHANGE'
  | 'COMPLEXITY_VARIATION'
  | 'RELATIONSHIP_CHANGE';

export type InsightCategory =
  | 'DEPENDENCY'
  | 'BOUNDARY'
  | 'EVOLUTION'
  | 'COMPLEXITY';

export interface ArchitectureInsight {
  readonly id: string;
  readonly category: InsightCategory;
  readonly subject: string;
  readonly observation: string;
  readonly interpretation: InsightInterpretation;
  readonly evidence: string[];
  readonly confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  readonly generatedAt: string;
}
