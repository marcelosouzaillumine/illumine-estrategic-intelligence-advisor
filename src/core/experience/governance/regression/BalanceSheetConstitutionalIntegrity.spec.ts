import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';
import { BalanceSheetNormalizer } from '../../../../capabilities/financial/infrastructure/adapters/BalanceSheetNormalizer';
import { BalanceSheetRawData } from '../../../../capabilities/financial/domain/models/BalanceSheetAnalysisInput';

describe('Balance Sheet Constitutional Integrity Gate (Wave 1.4.15.5)', () => {
  it('should validate all causal relations from raw data to narrative (Constitutional Test)', async () => {
    
    // 1. RAW ACCOUNTING DATA
    const raw2024: BalanceSheetRawData = {
      ano: 2024,
      ativoCirculante: 150000,
      ativoNaoCirculante: 100000,
      ativoTotal: 250000,
      passivoCirculante: 80000,
      passivoNaoCirculante: 70000,
      passivoTotal: 150000,
      patrimonioLiquido: 100000,
      caixaEquivalentes: 40000,
      clientes: 60000,
      estoques: 50000,
      fornecedores: 30000,
      passivosFinanceiros: 20000,
      lucrosAcumulados: 50000
    };

    const raw2025: BalanceSheetRawData = {
      ...raw2024,
      ano: 2025,
      ativoCirculante: 200000, // Caixa increased
      ativoTotal: 300000,
      patrimonioLiquido: 150000, // Balanced
      caixaEquivalentes: 90000
    };

    // 2. DATA NORMALIZATION (Temporal Integrity)
    const normalized = BalanceSheetNormalizer.normalize({
      current: raw2025,
      analysisPeriod: 2025, history: [raw2024, raw2025]
    });

    expect(normalized.coverage.firstPeriod).toBe(2024);
    expect(normalized.coverage.lastPeriod).toBe(2025);
    expect(normalized.coverage.filteredPeriods.length).toBe(2);

    // 3. INTELLIGENCE EXECUTION
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output: any = useCase.analyzeBalanceSheet({
      current: raw2025,
      analysisPeriod: 2025, history: [raw2024, raw2025]
    });

    // 4. METRIC & SCORE INTEGRITY
    const { technicalEvidence, overview, signals: signalsWrapper } = output;
    
    // Check Balance Integrity
    const evidenceItem = technicalEvidence;
    const indicators = evidenceItem.structuralTables[0].indicators;
    const integrity = evidenceItem.auditMetadata.balanceIntegrity; // wait, let's just assert on the overview confidence if it's too nested

    expect(integrity.balanced).toBe(true);
    expect(integrity.difference).toBe(0);
    expect(integrity.totalAssets).toBe(300000);

    // Check Metrics (Current Liquidity = 200000 / 80000 = 2.5)
    const currentLiquidity = indicators.find((i: any) => i.label === 'Liquidez Corrente');
    expect(currentLiquidity.value).toBe(2.5);
    expect(currentLiquidity.classificationLabel).toBe('EXCELLENT');

    // 5. DIAGNOSTIC NARRATIVE INTEGRITY
    // Since everything is strong, status should be STRONG, not VULNERABLE.
    expect(overview.healthStatus).toBe('STRONG');
    expect(overview.observation).toContain('empresa possui estrutura sólida');

    // 6. SIGNAL STATE MACHINE INTEGRITY
    expect((signalsWrapper as any).state).toBe('AVAILABLE_EMPTY');
    expect(signalsWrapper.items.length).toBe(0);

    // 7. INTENTIONAL CORRUPTION CAUSALITY TEST
    // Now we break the balance equation
    const corrupt2025 = { ...raw2025, ativoTotal: 350000 };
    const corruptOutput: any = useCase.analyzeBalanceSheet({
      current: corrupt2025,
      analysisPeriod: 2025, history: [raw2024, corrupt2025]
    });

    const corruptEvidenceItem = corruptOutput.pureViewModel.technicalEvidence;
    const corruptIntegrity = corruptEvidenceItem.auditMetadata.balanceIntegrity;
    
    expect(corruptIntegrity.balanced).toBe(false);
    expect(corruptIntegrity.difference).toBe(50000); // 350000 - 300000
    expect(corruptIntegrity.status).toBe('UNBALANCED');
    
    // Confidence drops
    const corruptOverview = corruptOutput.pureViewModel.overview;
    expect(corruptOverview.confidence).toBe('MEDIUM'); // Dropped from HIGH

  });
});
