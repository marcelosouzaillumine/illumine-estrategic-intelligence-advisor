import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('HistoricalTrajectoryQuality', () => {
  it('should guarantee that HistoricalTrajectory does not use prescriptive verbs like "A empresa melhorou"', () => {
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
      fullData(2023, 1050),
      fullData(2024, 1120),
      fullData(2025, 1200)
    ];

    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(mockData) ? mockData[mockData.length - 1] : mockData, analysisPeriod: 2025, history: Array.isArray(mockData) ? mockData : [mockData] });
    const trajectory = contract.pureViewModel.historicalEvolution.trajectory;

    expect(trajectory.explanation).not.toMatch(/empresa melhorou/i);
    expect(trajectory.explanation).toMatch(/evolução positiva/i);
  });
});
