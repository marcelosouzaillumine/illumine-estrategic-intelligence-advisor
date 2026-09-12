import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('FinancialPositionScoreHydration', () => {
  it('should hydrate Score correctly from raw data, mapping all dimensions', () => {
    const rawData = [
      { ano: 2025, ativoTotal: 1500, passivoTotal: 750, patrimonioLiquido: 750, estoques: 450, caixaEquivalentes: 800 }
    ];

    const useCase = new BalanceSheetIntelligenceUseCase();
    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });
    const scoreData = contract.pureViewModel.score!;

    // Assert overall
    expect(contract.pureViewModel.score!.available).toBe(true);
    expect(scoreData.overall.value).toBeDefined();
    expect(scoreData.overall.classification).toBeDefined();
    expect(scoreData.overall.explanation).toBeDefined();

    // Confidence should be LOW because we only provided 1 year of data
    expect(scoreData.overall.confidence).toBe('LOW');

    // Assert Dimensions
    expect(scoreData.dimensions.liquidity).toBeDefined();
    expect(scoreData.dimensions.solvencyAndCapitalStructure).toBeDefined();
    expect(scoreData.dimensions.workingCapital).toBeDefined();
    expect(scoreData.dimensions.assetQuality).toBeDefined();
    expect(scoreData.dimensions.evolution).toBeDefined();
    
    // Assert Evolution has LOW confidence due to 1 year of data
    expect(scoreData.dimensions.evolution.confidence).toBe('LOW');
  });
});
