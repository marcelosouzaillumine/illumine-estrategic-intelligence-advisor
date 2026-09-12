import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FinancialLineageIntegrityAdapter } from '../src/runtime/adapters/FinancialLineageIntegrityAdapter';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext, EngineExecutionResult } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('Financial Lineage Integrity Framework (FLIF) v1.3.2 Tests', () => {

  const buildBaseContext = (mockHistory: any[], cyclesCount = 4): InstitutionalContext => {
    return {
      input: {
        rawFinancialData: {
          filterYear: 2022,
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

  // Test 1: Verify DRE Net Income = EQE Net Income (assert validation failure on mismatch)
  it('Test 1: should raise EQS_DATA_INCONSISTENCY when DRE and DFC/EQE net income mismatch', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: 40000 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 1000 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 2000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 2000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 10000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 1000 }
    ];

    const context = buildBaseContext(mockHistory);
    
    // Mock DRE inference with a mismatched net income (e.g. 50000)
    context.inferences['LegacyDREAdapter'] = {
      domain: 'Operational Governance',
      metrics: {
        lucroLiq: 50000,
        recLiquida: 100000
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    // Run only DFC
    const dfcRes = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(dfcRes.success, true);
    
    // Check DFC raised EQS_NET_INCOME_LINEAGE_BREAK
    const violations = dfcRes.violations || [];
    const hasInconsistency = violations.some(v => v.rule === 'EQS_NET_INCOME_LINEAGE_BREAK');
    assert.strictEqual(hasInconsistency, true, 'Should detect DRE/DFC net income inconsistency');
  });

  // Test 2: Verify BP Caixa Final = DFC Caixa Final when reconciled (assert no gap/mismatch)
  it('Test 2: should reconcile BP Caixa Final and DFC Caixa Final when matching', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: 2000 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 5000 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 2000 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 7000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 7000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 50000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 }
    ];

    const context = buildBaseContext(mockHistory);
    
    // Mock DRE to match
    context.inferences['LegacyDREAdapter'] = {
      domain: 'Operational Governance',
      metrics: {
        lucroLiq: 2000,
        recLiquida: 100000
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    const dfcRes = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(dfcRes.success, true);

    const violations = dfcRes.violations || [];
    const hasDfcMismatch = violations.some(v => v.rule === 'DFC_RECONCILIATION_MISMATCH');
    assert.strictEqual(hasDfcMismatch, false, 'Should reconcile without DFC_RECONCILIATION_MISMATCH');
    
    assert.strictEqual(dfcRes.inference?.metrics.fiduciary.reconciliationGap, 0);
  });

  // Test 3: Verify Rendered Value = Engine Value (assert UI_RENDER_MISMATCH when they diverge)
  it('Test 3: should raise UI_RENDER_MISMATCH only when renderingPayload diverges from engine values', async () => {
    const context = buildBaseContext([]);
    
    // Mock upstream inferences
    context.inferences['LegacyFinancialAdapter'] = {
      domain: 'Financial',
      metrics: {},
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['LegacyDREAdapter'] = {
      domain: 'DRE',
      metrics: {
        lucroLiq: 30000
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['LegacyDFCAdapter'] = {
      domain: 'DFC',
      metrics: {
        lucroLiquido: 30000,
        fiduciary: {
          caixaFinalBP: 8000
        }
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    // Divergent rendering payload
    context.input.rawFinancialData = {
      renderingPayload: {
        lucroLiquido: 35000 // Diverges from DRE/DFC's 30000
      }
    };

    const flifRes = await FinancialLineageIntegrityAdapter.execute(context);
    assert.strictEqual(flifRes.success, true);

    const violations = flifRes.violations || [];
    const hasRenderMismatch = violations.some(v => v.rule === 'UI_RENDER_MISMATCH');
    assert.strictEqual(hasRenderMismatch, true, 'Should detect UI_RENDER_MISMATCH');
  });

  // Test 4: Detect || 0 fallbacks (SILENT_FALLBACK_DETECTED)
  it('Test 4: should detect SILENT_FALLBACK_DETECTED by evidence rules when critical metric is missing from source and is 0 in engine without trace', async () => {
    const context = buildBaseContext([]);
    
    context.inferences['LegacyFinancialAdapter'] = {
      domain: 'Financial',
      metrics: {},
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    // Lucro Líquido absent from DRE source
    context.inferences['LegacyDREAdapter'] = {
      domain: 'DRE',
      metrics: {
        lucroLiq: null // absent
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    // Lucro Líquido consumed as 0 in DFC
    context.inferences['LegacyDFCAdapter'] = {
      domain: 'DFC',
      metrics: {
        lucroLiquido: 0 // defaulted
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    const flifRes = await FinancialLineageIntegrityAdapter.execute(context);
    assert.strictEqual(flifRes.success, true);

    const violations = flifRes.violations || [];
    const hasSilentFallback = violations.some(v => v.rule === 'SILENT_FALLBACK_DETECTED');
    assert.strictEqual(hasSilentFallback, true, 'Should detect SILENT_FALLBACK_DETECTED');
  });

  // Test 5: Detect cross-engine inconsistencies
  it('Test 5: should detect CROSS_ENGINE_INCONSISTENCY when downstream engines diverge', async () => {
    const context = buildBaseContext([]);
    
    context.inferences['LegacyFinancialAdapter'] = {
      domain: 'Financial',
      metrics: {},
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['LegacyDREAdapter'] = {
      domain: 'DRE',
      metrics: {
        ebitda: 40000
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['LegacyDFCAdapter'] = {
      domain: 'DFC',
      metrics: {
        ebitda: 40000
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['EconomicNormalizationAdapter'] = {
      domain: 'Economic Normalization',
      metrics: {
        ebitda: {
          contabil: 45000 // Diverges from DRE's 40000
        }
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    const flifResult = FinancialLineageIntegrityAdapter.audit(context);
    const hasCrossEngineMismatch = flifResult.violations.some(v => v.rule === 'CROSS_ENGINE_INCONSISTENCY');
    assert.strictEqual(hasCrossEngineMismatch, true, 'Should detect CROSS_ENGINE_INCONSISTENCY');
  });

  // Test 6: Granatum 2022 Validation
  it('Test 6: Granatum 2022 dataset validation matches expected balances and disables Profit Without Cash on negative income', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 382483.91 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: -68548.88 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 6935.93 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 14037.70 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo Operacional', val: 7101.77 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 6935.93 }
    ];

    const context = buildBaseContext(mockHistory);
    
    // Mock DRE to match
    context.inferences['LegacyDREAdapter'] = {
      domain: 'Operational Governance',
      metrics: {
        lucroLiq: -68548.88,
        recLiquida: 382483.91
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };

    const dfcRes = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(dfcRes.success, true);

    const dfcMetrics = dfcRes.inference?.metrics;
    assert.strictEqual(dfcMetrics?.fiduciary.caixaInicialDFC, 6935.93);
    assert.strictEqual(dfcMetrics?.fiduciary.caixaFinalEstimadoDFC, 14037.70);
    assert.strictEqual(dfcMetrics?.fiduciary.reconciliationGap, 0);
    assert.strictEqual(dfcMetrics?.fiduciary.reconciliationMismatch, false);

    const hasProfitWithoutCash = dfcRes.violations?.some(v => v.rule === 'PROFIT_WITHOUT_CASH') ?? false;
    assert.strictEqual(hasProfitWithoutCash, false, 'PROFIT_WITHOUT_CASH should be blocked/absent on negative net income');
  });

});
