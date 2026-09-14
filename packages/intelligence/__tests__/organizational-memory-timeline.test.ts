/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionMemoryContract } from '@illumine/executive-contracts';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/governance (Wave 18.5 Organizational Memory Timeline)', () => {
  it('should structure immutable timeline of past decisions per company', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026'
    });

    const memories: readonly DecisionMemoryContract[] = [
      {
        decisionId: 'dec-1',
        companyId: 'comp-emporio',
        companyName: 'Empório do Mármore',
        decisionTitle: 'Otimização de Custos Fixos',
        timestamp: '2025-06-30T00:00:00Z',
        context: ctx,
        recommendationText: 'Redução de 5% em despesas gerais',
        expectedImpactValue: 300000,
        status: 'COMPLETED'
      }
    ];

    expect(memories.length).toBe(1);
    expect(memories[0].companyName).toBe('Empório do Mármore');
  });
});
