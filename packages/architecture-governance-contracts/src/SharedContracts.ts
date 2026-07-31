
export interface ArchitectureHealthScore {
  score: number;
  classification: string;
  delta: number;
}

export interface ArchitectureScore {
  health: ArchitectureHealthScore;
  risk: string;
  trend: string;
  architecture: number;
  product: number;
  ai: number;
  security: number;
  performance: number;
  scalability: number;
  governance: number;
  data: number;
  ux: number;
  commercial: number;
}

export interface CapabilityScore {
  health: number;
  risk: string;
  complexity: number;
  maturity: number;
  certification: number;
}

export interface RelationshipGraph {
  type: string;
  direction: 'INCOMING' | 'OUTGOING' | 'BIDIRECTIONAL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  strength: number;
  origin: string;
  target: string;
  metadata: Record<string, any>;
}
