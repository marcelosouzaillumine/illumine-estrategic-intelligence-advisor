import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../../../capabilities/financial/application/consolidation/FinancialPositionPureViewModelBuilder';
import { FinancialPositionIntelligenceContract } from '../../../../capabilities/financial/contracts/FinancialPositionIntelligenceContract';

describe('FinancialPositionOverviewHydration', () => {
  it('should perfectly map overview from Governance without inventing data', () => {
    // Arrange
    const intelligence: FinancialPositionIntelligenceContract = {
      executiveSummary: { available: false, items: [] },
      score: { available: false, items: [] },
      overview: {
        healthStatus: "ATTENTION",
        confidence: "HIGH",
        drivers: ["Redução da liquidez corrente"],
        observation: "O ativo circulante apresentou redução no período",
        evidence: "Dados do balanço patrimonial 2025",
        financialMeaning: "A estrutura indica maior pressão financeira"
      },
      diagnosis: { liquidity: [],  workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: [],  },
      signals: { available: false, items: [], missingReason: "none" },
      historicalEvolution: { available: false, items: [], missingReason: "none" },
      executiveQuestions: { available: false, items: [], missingReason: "none" },
      technicalEvidence: { available: false, items: [], missingReason: "none" }
    };

    // Act
    const viewModel = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: {},
      indicators: [],
      historicalSeries: [],
      intelligenceContract: intelligence
    });

    // Assert
    expect(viewModel.overview.healthStatus).toBe("ATTENTION");
    expect(viewModel.overview.observation).toBe("O ativo circulante apresentou redução no período");
    expect(viewModel.overview.evidence).toBe("Dados do balanço patrimonial 2025");
    expect(viewModel.overview.financialMeaning).toBe("A estrutura indica maior pressão financeira");
  });
});
