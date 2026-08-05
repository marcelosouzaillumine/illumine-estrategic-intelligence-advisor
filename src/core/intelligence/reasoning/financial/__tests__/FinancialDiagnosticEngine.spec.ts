import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialDiagnosticEngine } from '../FinancialDiagnosticEngine';

describe('FinancialDiagnosticEngine', () => {
  let engine: FinancialDiagnosticEngine;

  beforeEach(() => {
    engine = new FinancialDiagnosticEngine();
  });

  it('should output a full strategic diagnosis containing CFO questions for a Conservative Structure', () => {
    const relationships = [
      { relationship: 'Conservative Capital Structure', possibleImpact: '', confidence: 0.95 }
    ];
    
    const hypotheses = [
      { hypothesis: 'Capital accumulation without proportional reinvestment', confidence: 0.87, evidence: [] }
    ];

    const output = engine.synthesize(relationships, hypotheses);

    expect(output.diagnosis).toContain('estrutura patrimonial conservadora');
    expect(output.opportunities.length).toBeGreaterThan(0);
    expect(output.cfoQuestions.some(q => q.includes('O nível atual de caixa está alinhado'))).toBe(true);
  });
});
