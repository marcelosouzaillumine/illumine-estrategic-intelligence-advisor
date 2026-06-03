import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { EconomicNormalizationAdapter } from '../src/runtime/adapters/EconomicNormalizationAdapter';
import { ExecutiveDecisionAdapter } from '../src/runtime/adapters/ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from '../src/runtime/adapters/InstitutionalMemoryAdapter';
import { InstitutionalContext, EngineExecutionResult } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('Institutional Memory Engine (IME) - Adapter & Report Integration Tests', () => {

  const buildBaseContext = (mockHistory: any[], cyclesCount = 4): InstitutionalContext => {
    return {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
        },
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
    // 1. Financial
    const finRes = await LegacyFinancialAdapter.execute(context);
    context.inferences['LegacyFinancialAdapter'] = finRes.inference!;

    // 2. DRE
    const dreRes = await LegacyDREAdapter.execute(context);
    context.inferences['LegacyDREAdapter'] = dreRes.inference!;

    // 3. DFC
    const dfcRes = await LegacyDFCAdapter.execute(context);
    context.inferences['LegacyDFCAdapter'] = dfcRes.inference!;

    // 4. ENE
    const eneRes = await EconomicNormalizationAdapter.execute(context);
    context.inferences['EconomicNormalizationAdapter'] = eneRes.inference!;

    // 5. Executive Decision
    const execRes = await ExecutiveDecisionAdapter.execute(context);
    context.inferences['ExecutiveDecisionEngine'] = execRes.inference!;

    // 6. IME
    const imeRes = await InstitutionalMemoryAdapter.execute(context);
    context.inferences['InstitutionalMemoryEngine'] = imeRes.inference!;

    return {
      LegacyFinancialAdapter: finRes,
      LegacyDREAdapter: dreRes,
      LegacyDFCAdapter: dfcRes,
      EconomicNormalizationAdapter: eneRes,
      ExecutiveDecisionEngine: execRes,
      InstitutionalMemoryEngine: imeRes
    };
  };

  it('1. Deve calcular pontuação do IMS e níveis corretos para caso padrão de 4 ciclos', async () => {
    const mockHistory = [
      // 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 80000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 60000 },
      
      // 2022
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 180000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 40000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 90000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 280000 },
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 280000 },
      { year: 2022, docType: 'dre', category: 'EBITDA', val: 75000 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 55000 },

      // 2021
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 160000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 35000 },
      { year: 2021, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      { year: 2021, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 260000 },
      { year: 2021, docType: 'dre', category: 'Receita Líquida', val: 260000 },
      { year: 2021, docType: 'dre', category: 'EBITDA', val: 70000 },
      { year: 2021, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 50000 },

      // 2020
      { year: 2020, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 140000 },
      { year: 2020, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 30000 },
      { year: 2020, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 70000 },
      { year: 2020, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 240000 },
      { year: 2020, docType: 'dre', category: 'Receita Líquida', val: 240000 },
      { year: 2020, docType: 'dre', category: 'EBITDA', val: 65000 },
      { year: 2020, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 45000 }
    ];

    const context = buildBaseContext(mockHistory, 4);
    const results = await runAllEngines(context);

    assert.strictEqual(results.InstitutionalMemoryEngine.success, true);
    
    const imeMetrics = results.InstitutionalMemoryEngine.inference?.metrics;
    assert.ok(imeMetrics);
    assert.ok(imeMetrics.imsScore >= 70);
    assert.strictEqual(imeMetrics.trajectoryClassification, 'RECOVERING');
    assert.strictEqual(imeMetrics.isEarlyStage, false);
  });

  it('2. Deve atenuar pontuações no early-stage (< 3 ciclos) e definir score mínimo de 70', async () => {
    const mockHistory = [
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 1000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -50000 },
      { year: 2023, docType: 'dfc', conta: 'FCO', val: -60000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 },
      { year: 2022, docType: 'dre', category: 'EBITDA', val: -40000 }
    ];

    const context = buildBaseContext(mockHistory, 2);
    const results = await runAllEngines(context);

    assert.strictEqual(results.InstitutionalMemoryEngine.success, true);
    const imeMetrics = results.InstitutionalMemoryEngine.inference?.metrics;
    assert.ok(imeMetrics);
    assert.strictEqual(imeMetrics.isEarlyStage, true);
    assert.ok(imeMetrics.domains.treasury.score >= 70);
    assert.ok(imeMetrics.domains.earnings.score >= 70);
  });

  it('3. Deve acionar a sanitização de narrativas proibidas', async () => {
    // Injetamos um histórico problemático
    const mockHistory = [
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa', val: 1000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -100000 },
      { year: 2023, docType: 'dfc', category: 'FCO', val: -120000 },

      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa', val: 20000 },
      { year: 2022, docType: 'dre', category: 'EBITDA', val: -80000 },
      { year: 2022, docType: 'dfc', category: 'FCO', val: -100000 },

      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa', val: 50000 },
      { year: 2021, docType: 'dre', category: 'EBITDA', val: -50000 },
      { year: 2021, docType: 'dfc', category: 'FCO', val: -70000 }
    ];

    const context = buildBaseContext(mockHistory, 3);
    const results = await runAllEngines(context);

    const diagnosticText = results.InstitutionalMemoryEngine.inference?.narrative?.diagnostic || '';
    assert.ok(diagnosticText.length > 0);
    assert.ok(!diagnosticText.includes('management incompetence'));
    assert.ok(!diagnosticText.includes('fraudulent continuity'));
    assert.ok(!diagnosticText.includes('terminal deterioration'));
  });

  it('4. Deve gerar as 6 seções mandatórias no Board Pack Document', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 50000 },
      { year: 2022, docType: 'dre', category: 'EBITDA', val: 40000 },
      { year: 2021, docType: 'dre', category: 'EBITDA', val: 30000 }
    ];

    const context = buildBaseContext(mockHistory, 3);
    const results = await runAllEngines(context);
    
    // Simula a geração do relatório executivo integrado
    const reportPayload: any = {
      institutionalContext: {
        currentCycle: '2023',
        tenantId: 'TENANT-TEST'
      },
      inferences: {
        InstitutionalMemoryEngine: results.InstitutionalMemoryEngine.inference
      },
      runtimeMetadata: {
        lineageHash: 'lineage-test-hash',
        auditTrail: ['Engine executed.']
      }
    };

    const docOutput = InstitutionalBoardPackDocumentRuntime.generateDocument(reportPayload, 'BOARD');
    
    assert.ok(docOutput.markdownSections.institutionalMemorySummary);
    assert.ok(docOutput.markdownSections.ignoredRecommendationsReport);
    assert.ok(docOutput.markdownSections.trajectoryClassificationReport);
    assert.ok(docOutput.markdownSections.fiduciaryTimelineReport);
    assert.ok(docOutput.markdownSections.recurrenceHeatmapReport);
    assert.ok(docOutput.markdownSections.fiduciaryBehavioralInterpretationSummary);
  });
});
