/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 18.2 Executive Render Protocol v2.0)', () => {
  it('should verify decision engine provides data for all 8 cognitive layers (EER v1.0)', () => {
    const output = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 620000, ReceitaBruta: 8450000 }
    });

    expect(output.context.companyName).toBe('Empório do Mármore'); // Layer 1 Context
    expect(output.signal.signalTitle).toBeDefined(); // Layer 3 Synthesis
    expect(output.narrative.probableCause).toBeDefined(); // Layer 4 Diagnosis
    expect(output.recommendation.recommendationText).toBeDefined(); // Layer 7 Execution
    expect(output.context.confidenceLevel).toBeGreaterThanOrEqual(95.0); // Layer 6 Evidence
  });
});
