export type StressPropagationType = 
  | 'FINANCIAL' 
  | 'OPERATIONAL' 
  | 'LIQUIDITY' 
  | 'REPUTATIONAL_FLAG' 
  | 'SUPPLY_CHAIN' 
  | 'CAPITAL_ALLOCATION';

export type StressPropagationConfidence = 
  | 'DIRECT_EXPOSURE' 
  | 'INDIRECT_EXPOSURE' 
  | 'LOW_CONFIDENCE_PROPAGATION' 
  | 'UNVERIFIED_DEPENDENCY';

export interface ContagionEdge {
  sourceEntity: string;
  targetEntity: string;
  propagationType: StressPropagationType;
  causalReason: string;
  confidence: StressPropagationConfidence;
  propagationWeight: number; // 0.0 a 1.0
  affectedMetrics: string[];
  lineage: string; // Trilha explicativa
}

export interface StressPropagationWarning {
  warningId: string;
  sourceEntity: string;
  targetEntity?: string;
  message: string;
}

export interface SystemicRiskProfile {
  systemicStressMap: ContagionEdge[];
  propagatedRisks: ContagionEdge[]; // Aliased for external output convenience
  contagionLineage: string[];
  systemicConfidence: StressPropagationConfidence | 'EXACT_MATCH';
  stressPropagationWarnings: StressPropagationWarning[];
  affectedEntities: string[];
  criticalDependencyChains: ContagionEdge[][];
}
