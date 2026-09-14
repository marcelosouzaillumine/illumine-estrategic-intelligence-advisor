// src/core/runtime/behavioral-intelligence/ExecutiveConsistencyEngine.ts
//
// Executive Consistency Engine

import { ExecutiveDecision } from '../decision-intelligence/decision-types';

export class ExecutiveConsistencyEngine {
  /**
   * Evaluates the coherence between stated strategy motivations/assumptions and the actual decision domains.
   * Returns a consistency score between 0 and 100.
   */
  public static calculateConsistency(
    decision: ExecutiveDecision,
    history: ExecutiveDecision[]
  ): number {
    let score = 100;
    const motivation = (decision.motivation || '').toLowerCase();
    const { domains } = decision;

    const costSavingKeywords = [
      'reduzir custo', 'redução de custos', 'preservar caixa',
      'economia', 'corte de despesa', 'ajuste fiscal', 'prudência',
      'prudencia', 'contenção'
    ];

    const expansionKeywords = [
      'expansão', 'expansao', 'crescimento', 'investimento',
      'capex', 'aumentar capacidade', 'ampliação', 'ampliacao', 'escala'
    ];

    const hasCostSavingMotivation = costSavingKeywords.some(k => motivation.includes(k));
    const hasExpansionMotivation = expansionKeywords.some(k => motivation.includes(k));

    // 1. Check direct contradictions in current decision
    if (hasCostSavingMotivation) {
      if (domains.includes('Dividend Distribution') || domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
        score -= 30; // Contradiction: Stated saving cost but distributing or expanding
      }
    }

    if (hasExpansionMotivation) {
      if (domains.includes('Cost Reduction')) {
        score -= 30; // Contradiction: Stated expansion but cutting costs
      }
    }

    // 2. Compare against recent historical trends
    if (history && history.length > 0) {
      const recentHistory = history.slice(-5);
      const recentCostReductions = recentHistory.filter(d => d.domains.includes('Cost Reduction')).length;
      const recentExpansions = recentHistory.filter(d => d.domains.includes('Operational Expansion') || d.domains.includes('Workforce Expansion')).length;

      if (domains.includes('Dividend Distribution') && recentCostReductions >= 2) {
        score -= 20; // Stated cost-reduction stage but currently distributing cash
      }

      if (domains.includes('Operational Expansion') && recentCostReductions >= 3) {
        score -= 25; // Stated cost-reduction turnaround phase but launching new expansion
      }

      if (domains.includes('Cost Reduction') && recentExpansions >= 2) {
        score -= 15; // Quick pivot back to cost-cutting after expansion (instability)
      }
    }

    return Math.max(10, Math.min(100, score));
  }
}
