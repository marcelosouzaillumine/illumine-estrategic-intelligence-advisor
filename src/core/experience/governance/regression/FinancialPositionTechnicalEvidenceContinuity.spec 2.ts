import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('FinancialPositionTechnicalEvidenceContinuity', () => {
  it('should have technical evidence available when receiving balance sheet data', () => {
    const rawData = [
      { ano: 2025, ativoTotal: 1500, passivoTotal: 750, patrimonioLiquido: 750 }
    ];

    const useCase = new BalanceSheetIntelligenceUseCase();
    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });

    expect(contract.pureViewModel.technicalEvidence.available).toBe(true);
    expect(contract.pureViewModel.technicalEvidence.rows.length).toBeGreaterThan(0);
    expect(contract.pureViewModel.technicalEvidence.bpSummary.totalAssets).toBe(1500);
  });
});
