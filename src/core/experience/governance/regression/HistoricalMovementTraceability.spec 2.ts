import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('HistoricalMovementTraceability', () => {
  it('should guarantee that every HistoricalMovement has a metric, period, variation and source', () => {
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
      fullData(2024, 1000),
      fullData(2025, 1200)
    ];

    const contract = useCase.analyzeBalanceSheet({ current: (mockData as any)[(mockData as any).length - 1], analysisPeriod: 2025, history: mockData as any });
    const movements = contract.pureViewModel.historicalEvolution.movements;

    expect(movements.length).toBeGreaterThan(0);
    movements.forEach(m => {
      expect(m.metric).toBeDefined();
      expect(m.period).toBeDefined();
      expect(m.variation.absolute).toBeDefined();
      expect(m.variation.percentage).toBeDefined();
      expect(m.evidence.source).toBeDefined();
    });
  });
});
