import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CreditCommitteeSimulatorAdapter } from '../src/runtime/adapters/CreditCommitteeSimulatorAdapter';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { EconomicNormalizationAdapter } from '../src/runtime/adapters/EconomicNormalizationAdapter';
import { StressTestAdapter } from '../src/runtime/adapters/StressTestAdapter';
import { ExecutiveDecisionAdapter } from '../src/runtime/adapters/ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from '../src/runtime/adapters/InstitutionalMemoryAdapter';
import { BoardRiskMatrixAdapter } from '../src/runtime/adapters/BoardRiskMatrixAdapter';
import { InstitutionalContext, EngineExecutionResult } from '../src/runtime/types';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { buildBPHierarchy } from '../src/lib/bpEngine';

describe('Credit Committee Simulator (CCS) Tests', () => {

  const buildBaseContext = (mockHistory: any[], cyclesCount = 4, overrides = {}, rawFinancialDataOverrides = {}): InstitutionalContext => {
    const bpRows = mockHistory.filter(d => d.docType === 'bp' || d.type === 'bp');
    const dreRows = mockHistory.filter(d => d.docType === 'dre' || d.type === 'dre');
    
    const bpResultHierarchy = buildBPHierarchy(bpRows);
    const bpSummary = bpResultHierarchy.summary;
    
    const ebitdaRow = dreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const ebitda = ebitdaRow?.val ?? 0;
    
    const llRow = dreRows.find(d => {
      const cat = (d.category || d.conta || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cat.includes('lucro liquido') || cat.includes('resultado liquido') || cat.includes('prejuizo');
    });
    const lucroLiquido = llRow?.val ?? 0;
    
    const prevBpRows = mockHistory.filter(d => (d.docType === 'bp' || d.type === 'bp') && d.year === 2022);
    const prevBpSummary = buildBPHierarchy(prevBpRows).summary;
    const prevPl = prevBpSummary?.patrimonioLiquido || 0;
    const prevCaixa = prevBpSummary?.caixaEquivalentes || 0;
    
    const prevDreRows = mockHistory.filter(d => (d.docType === 'dre' || d.type === 'dre') && d.year === 2022);
    const prevEbitdaRow = prevDreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const prevEbitda = prevEbitdaRow?.val || 0;

    return {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory,
          covenantOverrides: overrides,
          bpSummary,
          ebitda,
          lucroLiquido,
          industry: 'Geral',
          prevPl,
          prevEbitda,
          prevCaixa,
          dreDataLength: dreRows.length,
          historicalCyclesCount: cyclesCount,
          ...rawFinancialDataOverrides
        },
        dreData: dreRows,
        historicalCyclesCount: cyclesCount,
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };
  };

  const runAllEngines = async (context: InstitutionalContext): Promise<Record<string, EngineExecutionResult>> => {
    const finRes = await LegacyFinancialAdapter.execute(context);
    if (finRes.success && finRes.inference) {
      context.inferences['LegacyFinancialAdapter'] = finRes.inference;
    }

    const dreRes = await LegacyDREAdapter.execute(context);
    if (dreRes.success && dreRes.inference) {
      context.inferences['LegacyDREAdapter'] = dreRes.inference;
    }

    const dfcRes = await LegacyDFCAdapter.execute(context);
    if (dfcRes.success && dfcRes.inference) {
      context.inferences['LegacyDFCAdapter'] = dfcRes.inference;
    }

    const eneRes = await EconomicNormalizationAdapter.execute(context);
    if (eneRes.success && eneRes.inference) {
      context.inferences['EconomicNormalizationAdapter'] = eneRes.inference;
    }

    const stressRes = await StressTestAdapter.execute(context);
    if (stressRes.success && stressRes.inference) {
      context.inferences['StressTestAdapter'] = stressRes.inference;
    }

    const execRes = await ExecutiveDecisionAdapter.execute(context);
    if (execRes.success && execRes.inference) {
      context.inferences['ExecutiveDecisionEngine'] = execRes.inference;
    }

    const imeRes = await InstitutionalMemoryAdapter.execute(context);
    if (imeRes.success && imeRes.inference) {
      context.inferences['InstitutionalMemoryEngine'] = imeRes.inference;
    }

    const brmRes = await BoardRiskMatrixAdapter.execute(context);
    if (brmRes.success && brmRes.inference) {
      context.inferences['BoardRiskMatrixAdapter'] = brmRes.inference;
    }

    const ccsRes = await CreditCommitteeSimulatorAdapter.execute(context);
    if (ccsRes.success && ccsRes.inference) {
      context.inferences['CreditCommitteeSimulatorEngine'] = ccsRes.inference;
    }

    return {
      LegacyFinancialAdapter: finRes,
      LegacyDREAdapter: dreRes,
      LegacyDFCAdapter: dfcRes,
      EconomicNormalizationAdapter: eneRes,
      StressTestAdapter: stressRes,
      ExecutiveDecisionEngine: execRes,
      InstitutionalMemoryEngine: imeRes,
      BoardRiskMatrixAdapter: brmRes,
      CreditCommitteeSimulatorEngine: ccsRes
    };
  };

  const mockHistoryData = [
    // 2023 BP
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 30000 }, // shortTermDebt
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 500000 },

    // 2022 BP
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 40000 },
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 450000 },
    { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 280000 },

    // DRE
    { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
    { year: 2023, docType: 'dre', category: 'EBITDA', val: 80000 },
    { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 40000 },
    { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 10000 },

    // DFC
    { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 60000 }
  ];

  it('1. Computes domain scores, overall CCS score, and suggested credit rating under standard scenario', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    assert.strictEqual(results.CreditCommitteeSimulatorEngine.success, true);
    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    
    assert.ok(ccsMetrics.ccsScore >= 50 && ccsMetrics.ccsScore <= 100);
    assert.ok(ccsMetrics.suggestedCreditRating);
    assert.ok(ccsMetrics.creditDecisionSimulation);
    assert.ok(ccsMetrics.domains);
  });

  it('2. Evaluates dynamic covenants and respects overrides', async () => {
    const overrides = {
      maxNetDebtEbitda: 2.0,
      minDscr: 2.0
    };
    const context = buildBaseContext(mockHistoryData, 4, overrides);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    assert.strictEqual(ccsMetrics.covenantThresholds.maxNetDebtEbitda, 2.0);
    assert.strictEqual(ccsMetrics.covenantThresholds.minDscr, 2.0);
  });

  it('3. Safely handles EBITDA <= 0 and returns BREACHED or NOT_COMPUTABLE', async () => {
    const negativeEbitdaHistory = [
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }, // cash = 10k
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 40000 }, // shortTermDebt = 40k, netDebt > 0
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 500000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },

      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -10000 }, // EBITDA <= 0
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -20000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -5000 }
    ];

    const context = buildBaseContext(negativeEbitdaHistory, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    
    // Check that Base scenario Net Debt / EBITDA is BREACHED since EBITDA <= 0 and debt > 0
    const baseScenario = ccsMetrics.stressScenarios.find((s: any) => s.name === 'Base Institutional Scenario');
    assert.ok(baseScenario);
    assert.strictEqual(baseScenario.breaches.some((b: string) => b.includes('Net Debt / EBITDA')), true);
  });

  it('4. Combined gating logic downgrades approval if stress covenants are breached', async () => {
    const stressHistory = [
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 }, // low cash
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 90000 }, // high debt
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 500000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },

      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 80000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 40000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 10000 } // low FCO
    ];

    const context = buildBaseContext(stressHistory, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    assert.notStrictEqual(ccsMetrics.creditDecisionSimulation, 'APPROVED');
  });

  it('5. Early-stage protection prevents extreme penalties and blocks DECLINED', async () => {
    const earlyStageHistory = [
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 1000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 50000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 15000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 10000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 50000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 1000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 50000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 10000 },

      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 15000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -5000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -8000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -4000 }
    ];

    const context = buildBaseContext(earlyStageHistory, 1); // 1 cycle
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    assert.strictEqual(ccsMetrics.isEarlyStage, true);
    assert.strictEqual(ccsMetrics.creditDecisionSimulation, 'RESTRICTED_CREDIT');
  });

  it('6. Add Credit Confidence Level correctly based on cycles and related party transactions', async () => {
    // 1 cycle = LOW_CONFIDENCE
    const contextLow = buildBaseContext(mockHistoryData, 1);
    const resultsLow = await runAllEngines(contextLow);
    assert.strictEqual(resultsLow.CreditCommitteeSimulatorEngine.inference?.metrics.institutionalCreditConfidence, 'LOW_CONFIDENCE');

    // 3 cycles = MODERATE_CONFIDENCE
    const contextMod = buildBaseContext(mockHistoryData, 3);
    const resultsMod = await runAllEngines(contextMod);
    assert.strictEqual(resultsMod.CreditCommitteeSimulatorEngine.inference?.metrics.institutionalCreditConfidence, 'MODERATE_CONFIDENCE');

    // 4 cycles = HIGH_CONFIDENCE
    const contextHigh = buildBaseContext(mockHistoryData, 5);
    const resultsHigh = await runAllEngines(contextHigh);
    assert.strictEqual(resultsHigh.CreditCommitteeSimulatorEngine.inference?.metrics.institutionalCreditConfidence, 'HIGH_CONFIDENCE');
  });

  it('7. Word-sanitization narrative guard is fully compliant', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    const diagnostic = results.CreditCommitteeSimulatorEngine.inference?.narrative?.diagnostic || '';
    
    assert.ok(diagnostic);
    assert.strictEqual(diagnostic.includes('bankruptcy'), false);
    assert.strictEqual(diagnostic.includes('falência'), false);
    assert.strictEqual(diagnostic.includes('fraud'), false);
    assert.strictEqual(diagnostic.includes('fraude'), false);
  });

  it('8. Appends the 7 Credit Committee Simulator sections to Board Pack markdown', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    const report: any = {
      institutionalContext: { tenantId: 'test-tenant', currentCycle: '2023-YoY' },
      runtimeMetadata: { lineageHash: 'LINEAGE-HASH-123', historicalCyclesAvailable: 4, auditTrail: [] },
      inferences: {
        BoardRiskMatrixAdapter: results.BoardRiskMatrixAdapter.inference!,
        CreditCommitteeSimulatorEngine: results.CreditCommitteeSimulatorEngine.inference!
      }
    };

    const docOutput = InstitutionalBoardPackDocumentRuntime.generateDocument(report, 'BOARD');
    assert.ok(docOutput);
    assert.ok(docOutput.markdownSections);
    
    // Check all 7 credit committee sections
    assert.ok(docOutput.markdownSections.creditCommitteeExecutiveSummary);
    assert.ok(docOutput.markdownSections.fundingReadinessReport);
    assert.ok(docOutput.markdownSections.covenantFragilityAnalysis);
    assert.ok(docOutput.markdownSections.treasuryStressSimulation);
    assert.ok(docOutput.markdownSections.refinancingExposureReport);
    assert.ok(docOutput.markdownSections.institutionalCreditReliabilitySummary);
    assert.ok(docOutput.markdownSections.institutionalSurvivabilityInterpretation);
  });

  it('9. Forward Treasury Engine Scenario projections and Delta comparison', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    assert.ok(ccsMetrics.stressScenarios);
    assert.strictEqual(ccsMetrics.stressScenarios.length, 5);

    // Verify 12 cycle points projected
    const stressSc = ccsMetrics.stressScenarios[0];
    assert.strictEqual(stressSc.trajectory.length, 12);
    
    // Check deltas populated
    assert.ok(ccsMetrics.deltas);
    assert.ok(ccsMetrics.deltas.stress);
    assert.strictEqual(ccsMetrics.deltas.stress.length, 12);
  });

  it('10. Covenant Cascade loops and depth limit', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    
    const refinancingShock = ccsMetrics.stressScenarios.find((s: any) => s.name === 'Refinancing Shock Scenario');
    assert.ok(refinancingShock);
    // Cascade logs must document cascade trigger propagation
    assert.ok(refinancingShock.cascadeLogs);
  });

  it('11. Fracture Detection and false positive shields/waivers', async () => {
    const fractureHistory = [
      // 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 30000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 500000 },
      
      // 2022 (higher cash, higher OCF, showing deterioration YoY -> triggering Cosmetic EBITDA fracture)
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 80000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },

      { year: 2023, docType: 'dre', category: 'Receita Bruta', val: 300000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'Despesas Administrativas', val: 210000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 90000 },
      { year: 2023, docType: 'dre', category: 'Despesas Financeiras', val: -40000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 40000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 10000 },

      { year: 2022, docType: 'dre', category: 'Receita Bruta', val: 300000 },
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2022, docType: 'dre', category: 'Despesas Administrativas', val: 220000 },
      { year: 2022, docType: 'dre', category: 'EBITDA', val: 80000 },
      { year: 2022, docType: 'dre', category: 'Despesas Financeiras', val: -45000 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: 35000 },

      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 20000 }, // FCO falls YoY (from 50k to 20k)
      { year: 2022, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 50000 }
    ];

    // Scenario A: Without active shield/waiver
    const contextNormal = buildBaseContext(fractureHistory, 4);
    const resultsNormal = await runAllEngines(contextNormal);
    const ccsMetricsNormal = resultsNormal.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetricsNormal);
    const cosmeticFractureNormal = ccsMetricsNormal.fractures.find((f: any) => f.code === 'FRACTURE_COSMETIC_EBITDA');
    assert.ok(cosmeticFractureNormal);
    assert.strictEqual(cosmeticFractureNormal.active, true);
    assert.strictEqual(cosmeticFractureNormal.waived, false);

    // Scenario B: With capex expansion active shield (waived)
    const contextWaived = buildBaseContext(fractureHistory, 4, {}, { capexExpansionActive: true });
    const resultsWaived = await runAllEngines(contextWaived);
    const ccsMetricsWaived = resultsWaived.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetricsWaived);
    const cosmeticFractureWaived = ccsMetricsWaived.fractures.find((f: any) => f.code === 'FRACTURE_COSMETIC_EBITDA');
    assert.ok(cosmeticFractureWaived);
    assert.strictEqual(cosmeticFractureWaived.active, true);
    assert.strictEqual(cosmeticFractureWaived.waived, true);
  });

  it('12. Funding Gap timeline and Recovery Momentum vector', async () => {
    const context = buildBaseContext(mockHistoryData, 4);
    const results = await runAllEngines(context);

    const ccsMetrics = results.CreditCommitteeSimulatorEngine.inference?.metrics;
    assert.ok(ccsMetrics);
    
    assert.ok(ccsMetrics.recoveryMomentum);
    assert.ok(ccsMetrics.fundingGapTimeline);
    assert.strictEqual(typeof ccsMetrics.fundingGapTimeline['30d'], 'number');
    assert.strictEqual(typeof ccsMetrics.fundingGapTimeline['360d'], 'number');
  });

});
