import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../../../capabilities/financial/application/consolidation/FinancialPositionPureViewModelBuilder';
import { FinancialPositionIntelligenceContract } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('HistoricalEvolutionHydration', () => {
  it('should perfectly map historical evolution from Governance', () => {
    // Arrange
    const intelligence: FinancialPositionIntelligenceContract = {
      executiveSummary: { available: false, items: [] },
      score: { available: false, items: [] },
      overview: { healthStatus: 'NEUTRAL', confidence: 'HIGH', drivers: [], observation: '', evidence: '', financialMeaning: '' },
      diagnosis: { liquidity: [],  workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: [],  },
      signals: { available: false, items: [], missingReason: 'none' },
      historicalEvolution: { 
        available: true, 
        items: [
          {
            available: true,
            periodCoverage: { firstYear: 2023, lastYear: 2024, periodsAnalyzed: 2 },
            trajectory: { classification: 'deteriorating', confidence: 'medium', explanation: 'Redução patrimonial concentrada em...' },
            movements: [{ metric: 'Patrimônio Líquido', period: '2023-2024', variation: { absolute: -100, percentage: -12.4 }, interpretation: '', evidence: { source: '' } }],
            executiveContext: { observation: '', implication: '' },
            availabilityReason: undefined
          } as any
        ]
      },
      executiveQuestions: { available: false, items: [], missingReason: 'none' },
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
    expect(viewModel.historicalEvolution.available).toBe(true);
    expect(viewModel.historicalEvolution.movements.length).toBeGreaterThan(0);
    expect(viewModel.historicalEvolution.movements[0].variation.percentage).toBe(-12.4);
  });
});
