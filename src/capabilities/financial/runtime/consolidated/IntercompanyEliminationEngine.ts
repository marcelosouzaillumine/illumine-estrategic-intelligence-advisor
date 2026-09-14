import { ConsolidatedOrchestratorInput, EliminationMatchConfidence } from './consolidated-types';
import { CrossEntityBalanceMatcher } from './CrossEntityBalanceMatcher';
import { IntercompanyMatchingResolver } from './IntercompanyMatchingResolver';
import { ConsolidatedAdjustmentRegistry } from './ConsolidatedAdjustmentRegistry';
import { IntercompanyConfidenceResolver } from './IntercompanyConfidenceResolver';

export interface IntercompanyEliminationResult {
  eliminatedEntries: any[];
  unreconciledIntercompany: any[];
  eliminationWarnings: any[];
  consolidationAdjustments: any[];
  eliminationConfidence: EliminationMatchConfidence;
}

export class IntercompanyEliminationEngine {
  private matcher: CrossEntityBalanceMatcher;
  private resolver: IntercompanyMatchingResolver;
  private confidenceResolver: IntercompanyConfidenceResolver;

  constructor() {
    this.matcher = new CrossEntityBalanceMatcher();
    this.resolver = new IntercompanyMatchingResolver();
    this.confidenceResolver = new IntercompanyConfidenceResolver();
  }

  public executeElimination(input: ConsolidatedOrchestratorInput): IntercompanyEliminationResult {
    const registry = new ConsolidatedAdjustmentRegistry();
    
    // 1. Encontrar candidatos
    const candidates = this.matcher.extractCandidates(input.entities);

    // 2. Resolver matches
    this.resolver.resolveMatches(candidates, registry, input.entities);

    // 3. Avaliar Confiança Global da Eliminação
    const confidences: EliminationMatchConfidence[] = [];
    if (registry.getUnreconciled().length > 0) {
       confidences.push('UNRECONCILED');
    }
    if (registry.getWarnings().some(w => w.message.includes('LOW_CONFIDENCE'))) {
       confidences.push('LOW_CONFIDENCE_MATCH');
    }
    // Se houve alguma eliminacao, eh pelo menos EXACT ou PROBABLE
    if (registry.getEliminatedEntries().length > 0 && confidences.length === 0) {
       confidences.push('EXACT_MATCH'); // Simplificado
    }

    const overallConfidence = this.confidenceResolver.resolveOverallEliminationConfidence(confidences);

    return {
      eliminatedEntries: registry.getEliminatedEntries(),
      unreconciledIntercompany: registry.getUnreconciled(),
      eliminationWarnings: registry.getWarnings(),
      consolidationAdjustments: registry.getAdjustments(),
      eliminationConfidence: overallConfidence
    };
  }
}
