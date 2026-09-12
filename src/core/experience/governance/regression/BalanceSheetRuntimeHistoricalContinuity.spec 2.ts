import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';
import { BalanceSheetAnalysisInput } from '../../../../capabilities/financial/domain/models/BalanceSheetAnalysisInput';

describe('BalanceSheetRuntimeHistoricalContinuity', () => {
  it('should perfectly transport 4 historical periods from input to contract', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    
    // Simulate the format returned by useAllFinancialData() -> historicalFinancialSeries
    const historicalFinancialSeries = [
      { ano: 2022, ativoTotal: 1000, passivoTotal: 500, ativoCirculante: 600, passivoCirculante: 300, caixaEquivalentes: 100 },
      { ano: 2023, ativoTotal: 1200, passivoTotal: 600, ativoCirculante: 700, passivoCirculante: 350, caixaEquivalentes: 150 },
      { ano: 2024, ativoTotal: 1400, passivoTotal: 700, ativoCirculante: 800, passivoCirculante: 400, caixaEquivalentes: 200 },
      { ano: 2025, ativoTotal: 1600, passivoTotal: 800, ativoCirculante: 900, passivoCirculante: 450, caixaEquivalentes: 250 }
    ];

    // Simulate the current year returned by useAnnualFinancialData() -> bpSummary
    const bpSummary = historicalFinancialSeries[3];

    // The explicit structured contract required to fix the Runtime Loss Point
    const input: BalanceSheetAnalysisInput = {
      current: bpSummary,
      analysisPeriod: 2025, history: historicalFinancialSeries
    };

    const contract = useCase.analyzeBalanceSheet(input);

    // 1. Historical Evolution Should Be Available
    expect(contract.pureViewModel.historicalEvolution.available).toBe(true);

    // 2. Exact periods should flow through correctly
    const evolutionItem = contract.pureViewModel.historicalEvolution;
    expect(evolutionItem).toBeDefined();
    
    // The items inside the period coverage should strictly reflect 4 years
    expect(evolutionItem.periodCoverage.periodsAnalyzed).toBe(4);
    expect(evolutionItem.periodCoverage.firstYear).toBe(2022);
    expect(evolutionItem.periodCoverage.lastYear).toBe(2025);
    
    // 3. Signals should continue to work. The perfect mock data generates 0 signals.
    expect(contract.pureViewModel.signals.available).toBe(false);
    expect(contract.pureViewModel.signals.items.length).toBe(0);
    
    // 4. The current period context must remain 2025
    // The summary traces to 2025
    expect(contract.pureViewModel.technicalEvidence.auditMetadata.year).toBe(2025);
  });

  it('should degrade gracefully if history is insufficient but provided structured input', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const historicalFinancialSeries = [
      { ano: 2025, ativoTotal: 1600, passivoTotal: 800, ativoCirculante: 900, passivoCirculante: 450, caixaEquivalentes: 250 }
    ];
    const bpSummary = historicalFinancialSeries[0];

    const input: BalanceSheetAnalysisInput = {
      current: bpSummary,
      analysisPeriod: 2024, history: historicalFinancialSeries
    };

    const contract = useCase.analyzeBalanceSheet(input);

    // It should properly declare missing history since it's just 1 year
    expect(contract.pureViewModel.historicalEvolution.available).toBe(false);
  });
});
