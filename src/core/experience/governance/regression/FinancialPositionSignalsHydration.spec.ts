import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../../../capabilities/financial/application/consolidation/FinancialPositionPureViewModelBuilder';
import { FinancialPositionIntelligenceContract } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('FinancialPositionSignalsHydration', () => {
  it('should perfectly map signals from Governance without losing properties', () => {
    // Arrange
    const intelligence: FinancialPositionIntelligenceContract = {
      executiveSummary: { available: false, items: [] },
      score: { available: false, items: [] },
      overview: { healthStatus: 'NEUTRAL', confidence: 'HIGH', drivers: [], observation: '', evidence: '', financialMeaning: '' },
      diagnosis: { liquidity: [],  workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: [],  },
      signals: { 
        available: true, 
        items: [
          { 
            id: 'sig_1',
            severity: 'attention', 
            category: 'liquidity', 
            materiality: 'high',
            persistence: 'structural',
            horizon: 'short_term',
            confidence: 'high',
            observation: { text: 'Concentração de estoques' },
            evidence: { text: 'Estoque / Ativo Total > 35%' },
            interpretation: { text: 'Risco de obsolescência e imobilização de capital.' }
          }
        ],
        missingReason: 'none'
      },
      historicalEvolution: { available: false, items: [], missingReason: 'none' },
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
    expect(viewModel.signals.items.length).toBeGreaterThan(0);
    const signalProps = viewModel.signals.items[0];
    expect(signalProps.observation).toBeDefined();
    expect(signalProps.interpretation).toBeDefined();
    expect(signalProps.observation.text).toBe('Concentração de estoques');
    expect(signalProps.evidence.text).toBe('Estoque / Ativo Total > 35%');
  });
});
