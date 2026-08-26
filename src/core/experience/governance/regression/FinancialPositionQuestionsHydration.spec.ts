import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../../../capabilities/financial/application/consolidation/FinancialPositionPureViewModelBuilder';
import { FinancialPositionIntelligenceContract } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('FinancialPositionQuestionsHydration', () => {
  it('should perfectly map questions and ensure no prescriptive verbs are present', () => {
    // Arrange
    const intelligence: FinancialPositionIntelligenceContract = {
      executiveSummary: { available: false, items: [] },
      score: { available: false, items: [] },
      overview: { healthStatus: 'NEUTRAL', confidence: 'HIGH', drivers: [], observation: '', evidence: '', financialMeaning: '' },
      diagnosis: { liquidity: [],  workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: [],  },
      signals: { available: false, items: [], missingReason: 'none' },
      historicalEvolution: { available: false, items: [], missingReason: 'none' },
      executiveQuestions: { 
        available: true, 
        items: [
          {
            id: 'q_1',
            question: 'Quais fatores explicam a redução da margem operacional no período?',
            originSignalId: 'sig_1',
            context: 'Observado na análise',
            intent: 'investigate'
          }
        ]
      },
      technicalEvidence: { available: false, items: [], missingReason: 'none' }
    };

    // Act
    const viewModel = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: {},
      indicators: [],
      historicalSeries: [],
      intelligenceContract: intelligence
    });

    // Assert
    expect(viewModel.executiveQuestions.length).toBeGreaterThan(0);
    const questionText = viewModel.executiveQuestions[0].question.toLowerCase();
    
    const prescriptiveVerbs = [
      'deve',
      'faça',
      'implemente',
      'reduza',
      'aumente',
      'contrate',
      'aprove'
    ];

    for (const verb of prescriptiveVerbs) {
      expect(questionText).not.toContain(verb);
    }
  });
});
