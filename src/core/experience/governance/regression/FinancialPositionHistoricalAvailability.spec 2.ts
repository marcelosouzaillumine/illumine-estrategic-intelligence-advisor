import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('FinancialPositionHistoricalAvailability', () => {
  it('should have history available when receiving multiple periods', () => {
    const mockBalanceSheetHistory = [
      { ano: 2022, ativoTotal: 1000, patrimonioLiquido: 500 },
      { ano: 2023, ativoTotal: 1200, patrimonioLiquido: 600 },
      { ano: 2024, ativoTotal: 1400, patrimonioLiquido: 700 },
      { ano: 2025, ativoTotal: 1500, patrimonioLiquido: 750 }
    ];

    const useCase = new BalanceSheetIntelligenceUseCase();
    const contract = useCase.analyzeBalanceSheet({ current: mockBalanceSheetHistory[mockBalanceSheetHistory.length - 1], analysisPeriod: 2025, history: mockBalanceSheetHistory });

    expect(contract.pureViewModel.historicalEvolution.available).toBe(true);
    expect(contract.pureViewModel.historicalEvolution.periodCoverage.periodsAnalyzed).toBe(4);
  });
});
