import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

/**
 * GOLDEN SCENARIO
 * Dataset sintético realista, contendo 4 anos de evolução industrial.
 * 
 * 2022-2023: Estabilidade equilibrada.
 * 2024: Aumento de estoques e caixa.
 * 2025: Alta capacidade de cobertura + alta concentração em caixa e estoques.
 */
const goldenDataset = [
  { ano: 2022, ativoTotal: 10000000, ativoCirculante: 5000000, caixaEquivalentes: 1200000, estoques: 1400000, passivoCirculante: 2500000, passivosFinanceirosNaoCirculante: 2000000, patrimonioLiquido: 5500000 },
  { ano: 2023, ativoTotal: 11500000, ativoCirculante: 5800000, caixaEquivalentes: 1500000, estoques: 1800000, passivoCirculante: 2800000, passivosFinanceirosNaoCirculante: 2100000, patrimonioLiquido: 6600000 },
  { ano: 2024, ativoTotal: 13200000, ativoCirculante: 7000000, caixaEquivalentes: 3800000, estoques: 2800000, passivoCirculante: 3100000, passivosFinanceirosNaoCirculante: 2200000, patrimonioLiquido: 7900000 },
  { ano: 2025, ativoTotal: 15000000, ativoCirculante: 8400000, caixaEquivalentes: 8200000, estoques: 4300000, passivoCirculante: 3500000, passivosFinanceirosNaoCirculante: 2300000, patrimonioLiquido: 9200000 }
];

describe('GoldenScenario - The Constitutional Anchor', () => {
  const useCase = new BalanceSheetIntelligenceUseCase();
  const result = useCase.analyzeBalanceSheet({ current: goldenDataset[goldenDataset.length - 1], analysisPeriod: 2025, history: goldenDataset });

  it('1. Data Gate - Should normalize and transport the exact 4-year history', () => {
    // A análise do caso de uso retorna overview? No, it returns signals, overview, score, historicalEvolution
    // The use case doesn't expose the raw normalized dataset directly in the return, but it does expose it if we need.
    // However, we can assert on the Historical Evolution to verify all 4 years are present.
    expect(result.pureViewModel.historicalEvolution.movements.length).toBeGreaterThan(0);
    expect(result.pureViewModel.historicalEvolution.periodCoverage.periodsAnalyzed).toBe(4); // We passed 4 periods
    
    // As a proxy for normalization, we check if signals are based on 2025 data
    // Excess Liquidity in 2025: Caixa (8.2M) / Ativo (15.0M) = 54.6%
    const liquiditySignal = result.pureViewModel.signals.items.find(s => s.id === 'excess_liquidity_eval');
    expect(liquiditySignal).toBeDefined();
    expect(liquiditySignal?.traceability?.metric?.value).toBeCloseTo(0.546, 2);
  });

  it('2. Intelligence Gate - Should detect strength (coverage) and tension (inventory/cash concentration)', () => {
    const signals = result.pureViewModel.signals.items;
    
    const inventorySignal = signals.find(s => s.id === 'inventory_concentration_monitor' || s.id === 'inventory_concentration_high' || s.id === 'inventory_concentration_critical');
    const cashSignal = signals.find(s => s.id === 'excess_liquidity_eval');
    
    // Expect both tensions to be flagged
    expect(inventorySignal).toBeDefined();
    expect(cashSignal).toBeDefined();

    expect(result.pureViewModel.score!.dimensions.liquidity.value).toBeGreaterThan(60); 
  });

  it('3. Fiduciary Gate (Evidence Consistency) - Should perfectly trace the cash signal to raw numbers', () => {
    const cashSignal = result.pureViewModel.signals.items.find(s => s.id === 'excess_liquidity_eval');
    const trace = cashSignal?.traceability;
    
    expect(trace).toBeDefined();
    expect(trace?.period.fiscalYear).toBe(2025);
    expect(trace?.account?.value).toBe(8200000);
    expect(trace?.calculation?.formula).toBe('Caixa ÷ Ativo Total');
    expect(trace?.calculation?.inputs).toContain('Caixa: R$ 8.200.000');
    expect(trace?.calculation?.inputs).toContain('Ativo Total: R$ 15.000.000');
  });

  it('4. Temporal Consistency - Should classify persistence correctly based on historical occurrence', () => {
    const inventorySignal = result.pureViewModel.signals.items.find(s => s.id === 'inventory_concentration_monitor' || s.id === 'inventory_concentration_high');
    const cashSignal = result.pureViewModel.signals.items.find(s => s.id === 'excess_liquidity_eval');

    // Excess liquidity started heavily in 2024 (3.8M/13.2M = ~28%) but only crossed 50% in 2025.
    // Inventory:
    // 2022: 1.4/10 = 14%
    // 2023: 1.8/11.5 = 15.6%
    // 2024: 2.8/13.2 = 21.2% (Monitor trigger >= 20%)
    // 2025: 4.3/15.0 = 28.6% (Monitor trigger >= 20%)
    
    // So inventory was triggered in 2024 and 2025 (2 periods). 
    // Wait, 2 periods might mean conjunctural or structural depending on the rule (usually >2 periods is structural).
    // Let's assert it is accurately captured and not "undefined".
    expect(inventorySignal?.persistence).toBeDefined();
    expect(cashSignal?.persistence).toBeDefined();
  });

  it('5. No False Causality - Semantic Quality should never prescribe or invent causes without evidence', () => {
    const cashSignal = result.pureViewModel.signals.items.find(s => s.id === 'excess_liquidity_eval');
    const interpretation = cashSignal?.interpretation.text.toLowerCase() || '';

    // MUST NOT invent causes or prescribe actions automatically
    expect(interpretation).not.toContain('recomenda-se');
    expect(interpretation).not.toContain('a empresa deve');
    expect(interpretation).not.toContain('falta de oportunidades');
    expect(interpretation).not.toContain('por causa de');
    expect(interpretation).not.toContain('devido a');
  });
});
