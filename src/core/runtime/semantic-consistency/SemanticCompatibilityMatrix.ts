import { SemanticConcept } from './ExecutiveSemanticRegistry';

export const SemanticCompatibilityMatrix: Record<SemanticConcept, string[]> = {
  [SemanticConcept.LIQUIDITY]: ['DFC', 'BP'],
  [SemanticConcept.SOLVENCY]: ['BP', 'DRE', 'ESG'],
  [SemanticConcept.EXECUTION_CAPACITY]: ['EFOS', 'Governance Journey'],
  [SemanticConcept.GOVERNANCE_MATURITY]: ['ESG', 'Governance Journey', 'Governance'],
  [SemanticConcept.CAPITAL_PRESERVATION]: ['BP', 'EIDF'],
  [SemanticConcept.GROWTH_SUSTAINABILITY]: ['DRE', 'ESSL'],
  [SemanticConcept.FIDUCIARY_RISK]: ['Governance', 'EFOS', 'ESG'],
  [SemanticConcept.INSTITUTIONAL_RESILIENCE]: ['ESSL', 'Governance Journey']
};

/**
 * Retorna verdadeiro se o motor tem autoridade semântica para opinar sobre o conceito.
 */
export function hasSemanticAuthority(engineId: string, concept: SemanticConcept): boolean {
  const allowedEngines = SemanticCompatibilityMatrix[concept];
  if (!allowedEngines) return false;
  return allowedEngines.includes(engineId);
}
