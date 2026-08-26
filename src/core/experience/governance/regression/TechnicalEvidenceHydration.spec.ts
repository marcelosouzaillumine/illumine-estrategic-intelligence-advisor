import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../../../capabilities/financial/application/consolidation/FinancialPositionPureViewModelBuilder';
import { FinancialPositionIntelligenceContract } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('TechnicalEvidenceHydration', () => {
  it('should perfectly map technical evidence structural tables', () => {
    // Arrange
    const intelligence: FinancialPositionIntelligenceContract = {
      executiveSummary: { available: false, items: [] },
      score: { available: false, items: [] },
      overview: { healthStatus: 'NEUTRAL', confidence: 'HIGH', drivers: [], observation: '', evidence: '', financialMeaning: '' },
      diagnosis: { liquidity: [],  workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: [],  },
      signals: { available: false, items: [], missingReason: 'none' },
      historicalEvolution: { available: false, items: [], missingReason: 'none' },
      executiveQuestions: { available: false, items: [], missingReason: 'none' },
      technicalEvidence: { 
        available: true, 
        items: [
          {
            bpSummary: {},
            rows: [],
            auditMetadata: {},
            structuralTables: [{ familyName: 'Ativo Circulante', indicators: [] }]
          }
        ]
      }
    };

    // Act
    const viewModel = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: {},
      indicators: [],
      historicalSeries: [],
      intelligenceContract: intelligence
    });

    // Assert
    expect(viewModel.technicalEvidence.available).toBe(true);
    expect(viewModel.technicalEvidence.structuralTables).toBeDefined();
    expect(viewModel.technicalEvidence.structuralTables.length).toBeGreaterThan(0);
    expect(viewModel.technicalEvidence.structuralTables[0].familyName).toBe('Ativo Circulante');
  });
});
