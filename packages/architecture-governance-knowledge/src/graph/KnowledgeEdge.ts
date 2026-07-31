export type ImpactIntensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ImpactType = 'Structural' | 'Functional' | 'Visual' | 'Performance' | 'Governance' | 'Security' | 'Compliance';

export interface KnowledgeEdge {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly relationship: string; // e.g. "DEPENDS_ON", "AFFECTS", "GOVERNS"
  readonly impactIntensity?: ImpactIntensity;
  readonly impactType?: ImpactType;
}
