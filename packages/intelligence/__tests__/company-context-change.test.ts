/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/governance (Wave 18.1 Company Context Change)', () => {
  it('should generate different narratives when company changes (ADR-068)', () => {
    const resA = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 500000, ReceitaBruta: 10000000 }
    });

    const resB = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-granatum',
      companyName: 'Granatum S.A.',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 2500000, ReceitaBruta: 12000000 }
    });

    expect(resA.narrative.executiveHeadline).toContain('Empório do Mármore');
    expect(resB.narrative.executiveHeadline).toContain('Granatum S.A.');
    expect(resA.narrative.executiveHeadline).not.toEqual(resB.narrative.executiveHeadline);
  });
});
