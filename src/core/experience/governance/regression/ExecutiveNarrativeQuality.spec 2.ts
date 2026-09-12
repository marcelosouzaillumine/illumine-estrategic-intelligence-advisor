import { describe, it, expect } from 'vitest';
import { FinancialNarrativeEngine } from '../../../../capabilities/financial/intelligence/narrative/FinancialNarrativeEngine';
import { ExecutivePositionSummaryEngine } from '../../../../capabilities/financial/intelligence/narrative/ExecutivePositionSummaryEngine';

describe('ExecutiveNarrativeQuality', () => {
  it('should not prescribe actions in FinancialNarrativeEngine', () => {
    const context = {
      metric: 'Estoque',
      value: '30%',
      category: 'Concentração de Estoques'
    };

    const result = FinancialNarrativeEngine.generateInterpretation(context);

    // Should not contain prescritive words
    expect(result.text.toLowerCase()).not.toContain('deve');
    expect(result.text.toLowerCase()).not.toContain('precisa');
    expect(result.text.toLowerCase()).not.toContain('recomenda-se');
    
    // Should be factual and contextual
    expect(result.text).toContain('A estrutura apresenta comportamento contábil que requer análise complementar');
  });

  it('should organize executive summary without generating new assertions', () => {
    const signals = [
      {
        id: 'sig_1',
        category: 'liquidity',
        severity: 'attention',
        observation: { text: 'Concentração detectada' },
        evidence: { text: 'Estoque > 35%' },
        interpretation: { text: 'Risco operacional' }
      }
    ] as any;

    const questions = [
      { id: 'q_1', question: 'Qual o impacto?', originSignalId: 'sig_1' }
    ] as any;

    const summary = ExecutivePositionSummaryEngine.synthesize(signals, questions, 'ATTENTION');

    // Should map the exact observation and interpretation
    expect(summary.attentionPoints[0].title).toBe('Concentração detectada');
    expect(summary.attentionPoints[0].explanation).toBe('Risco operacional');
    expect(summary.centralQuestion.question).toBe('Qual o impacto?');
  });
});
