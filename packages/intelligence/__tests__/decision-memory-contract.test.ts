/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionMemoryContract } from '@illumine/executive-contracts';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/governance (Wave 18.5 Decision Memory Contract)', () => {
  it('should validate DecisionMemoryContract for historical decision tracking (ADR-082)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-100',
      companyName: 'Granatum S.A.',
      pageId: 'DREPage',
      period: '2026'
    });

    const memory: DecisionMemoryContract = {
      decisionId: 'dec-100',
      companyId: 'comp-100',
      companyName: 'Granatum S.A.',
      decisionTitle: 'Reestruturação de Passivos Curto Prazo',
      timestamp: '2026-07-30T04:30:00Z',
      context: ctx,
      recommendationText: 'Alongar perfil de dívida bancária',
      expectedImpactValue: 500000,
      actualOutcomeValue: 420000,
      variancePercent: 84.0,
      status: 'EVALUATED'
    };

    expect(memory.decisionId).toBe('dec-100');
    expect(memory.expectedImpactValue).toBe(500000);
    expect(memory.actualOutcomeValue).toBe(420000);
  });
});
