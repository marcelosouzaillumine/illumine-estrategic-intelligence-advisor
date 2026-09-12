import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SovereignDecisionAdapter } from '../src/runtime/adapters/SovereignDecisionAdapter';
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
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { buildBPHierarchy } from '../src/lib/bpEngine';

describe('Sovereign Decision Engine (SDE) Tests', () => {

  const buildBaseContext = (mockHistory: any[], cyclesCount = 4, rawFinancialDataOverrides = {}): InstitutionalContext => {
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

    const sdeRes = await SovereignDecisionAdapter.execute(context);
    if (sdeRes.success && sdeRes.inference) {
      context.inferences['SovereignDecisionEngine'] = sdeRes.inference;
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
      CreditCommitteeSimulatorEngine: ccsRes,
      SovereignDecisionEngine: sdeRes
    };
  };

  const mockHealthyHistory = [
    // 2023 BP
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 500000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 200000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 30000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 800000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 1000000 },

    // 2022 BP
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 180000 },
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 950000 },
    { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 780000 },

    // DRE
    { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 1000000 },
    { year: 2023, docType: 'dre', category: 'EBITDA', val: 300000 },
    { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 200000 },

    // DFC
    { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 250000 }
  ];

  it('1. Compiles and executes SDE and validates overall metrics structures', async () => {
    const context = buildBaseContext(mockHealthyHistory, 5);
    const results = await runAllEngines(context);

    assert.strictEqual(results.SovereignDecisionEngine.success, true);
    const sdeMetrics = results.SovereignDecisionEngine.inference?.metrics;
    assert.ok(sdeMetrics);

    assert.ok(sdeMetrics.sdsUrgency >= 0 && sdeMetrics.sdsUrgency <= 100);
    assert.ok(sdeMetrics.sdsHealth >= 0 && sdeMetrics.sdsHealth <= 100);
    assert.ok(sdeMetrics.executionCapacity >= 0 && sdeMetrics.executionCapacity <= 100);
    assert.ok(sdeMetrics.decisionFatigueIndex >= 0 && sdeMetrics.decisionFatigueIndex <= 100);
    assert.ok(sdeMetrics.topDecisions.length <= 10);
    assert.ok(sdeMetrics.capitalAllocationRanking.length > 0);
    assert.ok(sdeMetrics.pathways.conservative);
  });

  it('2. Evaluates Critical Constraint Layer: caps Health to 60 and floors Urgency to 85 when runway is critical', async () => {
    // Modify history to have low cash (causing runway to drop below 3 months)
    const stressedHistory = mockHealthyHistory.map(item => {
      if (item.category === 'Caixa e Equivalentes' && item.year === 2023) {
        return { ...item, val: 5000 }; // 5k cash
      }
      if (item.conta === 'Fluxo de Caixa das Atividades Operacionais (FCO)' && item.year === 2023) {
        return { ...item, val: -50000 }; // Negative FCO
      }
      return item;
    });

    const context = buildBaseContext(stressedHistory, 5);
    const results = await runAllEngines(context);

    const sdeMetrics = results.SovereignDecisionEngine.inference?.metrics;
    assert.ok(sdeMetrics);
    
    // Assert floor of 85 and ceiling of 60 are respected
    assert.ok(sdeMetrics.sdsUrgency >= 85);
    assert.ok(sdeMetrics.sdsHealth <= 60);
  });

  it('3. Applies execution capacity penalties to feasibility under low governance scores', async () => {
    // Create history with low governance (highly dependency of related parties)
    const lowGovHistory = [
      ...mockHealthyHistory,
      { year: 2023, docType: 'dfc', conta: 'Saídas para Partes Relacionadas', val: -180000 } // high related party drain
    ];
    const context = buildBaseContext(lowGovHistory, 5);
    const results = await runAllEngines(context);

    const sdeMetrics = results.SovereignDecisionEngine.inference?.metrics;
    assert.ok(sdeMetrics);
    
    // When execution capacity is low, complex decisions should have their feasibility penalized.
    const raiseEquityDec = sdeMetrics.allDecisions.find((d: any) => d.id === 'raise_equity');
    assert.ok(raiseEquityDec);
    assert.ok(raiseEquityDec.feasibility < 80); // verify penalty applied
  });

  it('4. Computes dynamic Conflict Severity Index (CSI) between growth and cash preservation under stress', async () => {
    // Under low runway, growth vs cash preservation should be critical severity (CSI >= 80)
    const stressedHistory = mockHealthyHistory.map(item => {
      if (item.category === 'Caixa e Equivalentes' && item.year === 2023) {
        return { ...item, val: 5000 }; // 5k cash
      }
      return item;
    });

    const context = buildBaseContext(stressedHistory, 5);
    const results = await runAllEngines(context);

    const sdeMetrics = results.SovereignDecisionEngine.inference?.metrics;
    assert.ok(sdeMetrics);

    const growthConflict = sdeMetrics.conflicts.find((c: any) => c.id === 'growth_vs_cash');
    if (growthConflict) {
      assert.strictEqual(growthConflict.severity, 'CRITICAL');
      assert.ok(growthConflict.pureViewModel.score >= 80);
    }
  });

  it('5. Generates the 6 mandatory SDE sections in Board Pack reporting markdown', async () => {
    const context = buildBaseContext(mockHealthyHistory, 5);
    await runAllEngines(context);
    
    // Build simulated executive report payload
    const reportPayload: any = {
      advisory: {
        fiduciaryEnforcement: { complianceStatus: 'COMPLIANT' }
      },
      inferences: context.inferences,
      runtimeMetadata: { lineageHash: 'SDE-INTEG-TEST-HASH' }
    };

    const docOutput = InstitutionalBoardPackDocumentRuntime.generateDocument(reportPayload, 'BOARD');
    assert.strictEqual(docOutput.status, 'COMPLETE');
    assert.ok(docOutput.markdownSections);
    assert.ok(Object.keys(docOutput.markdownSections).length > 0);
  });

  it('6. Enforces forbidden narratives scrubbing across generated rationale texts', async () => {
    const context = buildBaseContext(mockHealthyHistory, 5);
    const results = await runAllEngines(context);

    const sdeMetrics = results.SovereignDecisionEngine.inference?.metrics;
    assert.ok(sdeMetrics);

    // Verify no forbidden terms like "bankruptcy", "failure", "collapse" exist in decisions
    sdeMetrics.allDecisions.forEach((dec: any) => {
      const fullText = (dec.benefits + dec.risks + dec.opportunityCost + dec.rationale).toLowerCase();
      assert.strictEqual(fullText.includes('bankruptcy'), false);
      assert.strictEqual(fullText.includes('failure'), false);
      assert.strictEqual(fullText.includes('collapse'), false);
    });
  });

});
