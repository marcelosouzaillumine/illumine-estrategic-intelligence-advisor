export enum SemanticConcept {
  LIQUIDITY = 'LIQUIDITY',
  SOLVENCY = 'SOLVENCY',
  EXECUTION_CAPACITY = 'EXECUTION_CAPACITY',
  GOVERNANCE_MATURITY = 'GOVERNANCE_MATURITY',
  CAPITAL_PRESERVATION = 'CAPITAL_PRESERVATION',
  GROWTH_SUSTAINABILITY = 'GROWTH_SUSTAINABILITY',
  FIDUCIARY_RISK = 'FIDUCIARY_RISK',
  INSTITUTIONAL_RESILIENCE = 'INSTITUTIONAL_RESILIENCE'
}

export interface EngineSemanticOutput {
  engineId: string;
  concept: SemanticConcept;
  rawClassification: string;
  narrative?: string;
  confidenceScore?: number;
}
