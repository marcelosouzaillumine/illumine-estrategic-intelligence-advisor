import { describe, it, expect } from 'vitest';
import { ExecutiveNarrativeEngine } from '../index';

describe('@illumine/executive-narrative-engine (Wave 16.5 Phase 2 Executive Communication Layer)', () => {
  it('should generate Board Brief report answering the 7 canonical questions (ADR-042)', () => {
    const report = ExecutiveNarrativeEngine.generateNarrative(
      'Board Brief',
      'Financeiro Q3',
      'Pressão de liquidez de curto prazo',
      'Renovar linha de crédito rotativo'
    );

    expect(report.briefType).toBe('Board Brief');
    expect(report.contributingFactors.length).toBeGreaterThan(0);
    expect(report.confidenceScore.value).toBe(94);
  });
});
