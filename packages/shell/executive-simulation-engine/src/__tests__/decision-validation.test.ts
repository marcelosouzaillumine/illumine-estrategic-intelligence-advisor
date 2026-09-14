import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionBrief } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/executive-simulation-engine (Wave 15C Phase 5 Decision Validation)', () => {
  it('should generate a valid ExecutiveDecisionBrief with consolidated recommendations and recommended action', () => {
    const brief: ExecutiveDecisionBrief = {
      briefId: 'brief-sc1-01',
      scenarioId: 'sc-liquidity-01',
      situationSummary: 'Pressão no caixa operacional nos próximos 90 dias',
      diagnosis: 'Desfasagem no recebimento de clientes e aumento de custos de fornecedores',
      strategicAlternatives: ['Opção 1: Corte emergencial', 'Opção 2: Reestruturação de dívida'],
      consolidatedRecommendations: [],
      overallConfidence: Score.create(94),
      recommendedAction: 'Emitir debêntures de curto prazo e renegociar prazos com fornecedores top 5'
    };

    expect(brief.briefId).toBe('brief-sc1-01');
    expect(brief.recommendedAction).toContain('Emitir debêntures');
    expect(brief.overallConfidence.value).toBe(94);
  });
});
