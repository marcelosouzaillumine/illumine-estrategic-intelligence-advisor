import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialHypothesisEngine } from '../FinancialHypothesisEngine';

describe('FinancialHypothesisEngine', () => {
  let engine: FinancialHypothesisEngine;

  beforeEach(() => {
    engine = new FinancialHypothesisEngine();
  });

  it('should generate "Capital accumulation without proportional reinvestment" hypothesis given a Conservative Capital Structure', () => {
    const relationships = [
      { relationship: 'Conservative Capital Structure', possibleImpact: '', confidence: 0.95 }
    ];

    const hypotheses = engine.generate(relationships);
    expect(hypotheses.length).toBe(1);
    expect(hypotheses[0].hypothesis).toBe('Capital accumulation without proportional reinvestment');
    expect(hypotheses[0].confidence).toBe(0.87); // 0.95 - 0.08
  });
});
