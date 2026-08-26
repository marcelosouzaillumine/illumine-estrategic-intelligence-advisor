import { describe, it, expect } from 'vitest';
import { FinancialPositionPureViewModelBuilder } from '../../application/consolidation/FinancialPositionPureViewModelBuilder';
import { BalanceSheetIntelligenceUseCase } from '../../application/usecases/BalanceSheetIntelligenceUseCase';

describe('P0.2/P0.4/P0.5 Constitutional Gates', () => {
  
  it('GATE 1 & 2 & 3: ViewModel Formatting & Zero Conservation', () => {
    const rawData = {
      liquidity: [
        { id: 'liq1', value: 1.752793629597544, unit: 'x' }, // Raw decimal
        { id: 'liq2', value: undefined }, // Unavailable
        { id: 'liq3', value: 0, unit: '%' } // Real zero
      ]
    };
    
    // Simulate IntelligenceContract payload
    const mockContract = {
      overview: {},
      diagnosis: {
        liquidity: rawData.liquidity,
        solvencyAndCapitalStructure: [],
        workingCapital: [],
        assetQuality: []
      },
      signals: { state: 'AVAILABLE_EMPTY', available: true, items: [] },
      historicalEvolution: { available: false, items: [] },
      score: { available: true, items: [{ overall: 73 }] },
      executiveQuestions: { items: [] },
      technicalEvidence: { available: true, items: [] }
    };

    const viewModel = FinancialPositionPureViewModelBuilder.build({
      balanceSheet: {},
      indicators: [],
      historicalSeries: [],
      intelligenceContract: mockContract as any
    });

    const liq1 = viewModel.diagnosis.liquidity.find(i => i.code === 'liq1');
    const liq2 = viewModel.diagnosis.liquidity.find(i => i.code === 'liq2');
    const liq3 = viewModel.diagnosis.liquidity.find(i => i.code === 'liq3');

    // Gate 1: No raw metric leakage (format correctly)
    expect(liq1?.formattedValue).toContain('1,75x');
    expect(liq1?.formattedValue).not.toContain('1.752793629597544');

    // Gate 2: Undefined remains unavailable, not zero
    expect(liq2?.availability).toBe('UNAVAILABLE');
    expect(liq2?.value).toBeUndefined();

    // Gate 3: Real zero remains zero, not unavailable
    expect(liq3?.availability).toBe('ZERO');
    expect(liq3?.value).toBe(0);
    expect(liq3?.formattedValue).toContain('0,00%');
  });

  it('GATE 4: Analysis without signals is AVAILABLE_EMPTY but Score survives', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    
    // Input with valid data but unlikely to trigger any severe signals
    const input = {
      analysisPeriod: { year: 2024 },
      current: {
        ano: 2024,
        ativoCirculante: 1000,
        ativoNaoCirculante: 500,
        ativoTotal: 1500,
        passivoCirculante: 200,
        passivoNaoCirculante: 100,
        passivoTotal: 300,
        patrimonioLiquido: 1200,
        caixaEquivalentes: 500,
        clientes: 300,
        estoques: 200,
        imobilizado: 500,
        fornecedores: 100,
        obrigacoesTrabalhistas: 50,
        tributos: 50,
        passivosFinanceiros: 0,
        passivosFinanceirosNaoCirculante: 0,
        capitalSocial: 1000,
        lucrosAcumulados: 200
      },
      history: []
    } as any;

    const contract = useCase.analyzeBalanceSheet(input as any);
    
    // Signals should be AVAILABLE_EMPTY
    expect(contract.pureViewModel.signals.state).toBe('AVAILABLE_EMPTY');
    
    // Score should survive
    expect(contract.pureViewModel.score?.available).toBe(true);
  });

  it('GATE 5: Analysis Unavailable on missing data', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    
    const input = {
      analysisPeriod: { year: 2024 },
      current: {
        ano: 2024,
        ativoCirculante: undefined,
        ativoNaoCirculante: undefined,
        ativoTotal: undefined, // undefined total assets = no data
        passivoCirculante: undefined,
        passivoNaoCirculante: undefined,
        passivoTotal: undefined,
        patrimonioLiquido: undefined
      },
      history: []
    } as any;

    // UseCase falls back on calculations when everything is zero, which leads to NaNs, etc.
    // If the backend handles this gracefully, let's see what happens.
    // However, if the error happens, we get a graceful fallback
    const contract = useCase.analyzeBalanceSheet(input as any);
    
    // Usually if total assets = 0, technical evidence is marked unavailable
    expect(contract.pureViewModel.technicalEvidence?.available).toBe(false);
  });
});
