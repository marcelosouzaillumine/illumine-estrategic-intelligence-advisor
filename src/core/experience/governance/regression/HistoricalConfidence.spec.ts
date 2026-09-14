import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('HistoricalConfidence', () => {
  it('should return LOW confidence if periodsAnalyzed is 1', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const mockData = [
      {
        ano: 2025,
        ativoCirculante: 0, ativoNaoCirculante: 0, caixaEquivalentes: 0, clientes: 0, estoques: 0, imobilizado: 0, ativoTotal: 1200,
        passivoCirculante: 0, passivoNaoCirculante: 0, fornecedores: 0, obrigacoesTrabalhistas: 0, tributos: 0, passivosFinanceiros: 0, passivosFinanceirosNaoCirculante: 0, passivoTotal: 500,
        capitalSocial: 0, lucrosAcumulados: 0, patrimonioLiquido: 700
      }
    ];

    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(mockData) ? mockData[mockData.length - 1] : mockData, analysisPeriod: 2024, history: Array.isArray(mockData) ? mockData : [mockData] });
    // When only 1 period, history available should be false and availabilityReason provided
    expect(contract.pureViewModel.historicalEvolution.available).toBe(false);
    expect(contract.pureViewModel.historicalEvolution.availabilityReason?.type).toBe('INSUFFICIENT_HISTORY');
  });

  it('should return HIGH confidence if periodsAnalyzed >= 4', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const fullData = (ano: number, val: number) => ({
      ano,
      ativoTotal: val, passivoTotal: val * 0.5, patrimonioLiquido: val * 0.5,
      ativoCirculante: val, ativoNaoCirculante: 0,
      passivoCirculante: val * 0.5, passivoNaoCirculante: 0,
      caixaEquivalentes: val, clientes: 0, estoques: 0, imobilizado: 0,
      fornecedores: val * 0.5, obrigacoesTrabalhistas: 0, tributos: 0, passivosFinanceiros: 0, passivosFinanceirosNaoCirculante: 0,
      capitalSocial: val * 0.5, lucrosAcumulados: 0
    });

    const mockData = [
      fullData(2022, 1000),
      fullData(2023, 1100),
      fullData(2024, 1200),
      fullData(2025, 1300)
    ];

    const contract = useCase.analyzeBalanceSheet({ current: (mockData as any)[(mockData as any).length - 1], analysisPeriod: 2025, history: mockData as any });
    expect(contract.pureViewModel.historicalEvolution.available).toBe(true);
    expect(contract.pureViewModel.historicalEvolution.trajectory.confidence).toBe('high');
  });
});
