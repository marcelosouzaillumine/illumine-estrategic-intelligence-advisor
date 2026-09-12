import { describe, it, expect } from 'vitest';
import { ExecutiveQuestionEngine } from '../../../../capabilities/financial/intelligence/questions/ExecutiveQuestionEngine';
import { IntelligenceSignal } from '../../../../capabilities/financial/contracts/IntelligenceSignal';

describe('ExecutiveLanguageQuality', () => {
  it('should not contain prescriptive verbs in executive questions', () => {
    const mockSignals: IntelligenceSignal[] = [
      {
        id: 's1',
        category: 'liquidity',
        severity: 'attention',
        materiality: 'high',
        persistence: 'structural',
        horizon: 'short_term',
        confidence: 'high',
        observation: { text: 'Baixa liquidez' },
        evidence: { text: 'Índice 0,8' },
        interpretation: { text: 'A estrutura...' }
      }
    ];

    const questions = ExecutiveQuestionEngine.generateQuestionsForSignals(mockSignals);
    
    const forbiddenVerbs = ['deve', 'faça', 'reduza', 'aumente', 'implemente'];

    for (const q of questions) {
      const lowerQuestion = q.question.toLowerCase();
      for (const verb of forbiddenVerbs) {
        expect(lowerQuestion).not.toContain(verb);
      }
    }
  });
});
