export interface ScenarioImpactReference {
  impactId: string;
  sourceNodeId: string;
  targetNodeId: string;
  
  relationshipType: 'CAUSAL' | 'CORRELATIONAL' | 'DEPENDENCY' | 'RISK_VECTOR';
  
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}
