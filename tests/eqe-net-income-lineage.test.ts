import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractSovereignNetIncome, extractSovereignNetIncomeWithAccount, LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { FinancialLineageIntegrityAdapter } from '../src/runtime/adapters/FinancialLineageIntegrityAdapter';
import { InstitutionalContext } from '../src/runtime/types';

describe('EQE Net Income Lineage Stabilization Tests', () => {

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

  // Test 1: Verify all DRE net income aliases are matched and extracted
  it('Test 1: should extract net income from all defined aliases', () => {
    const aliases = [
      { conta: 'Net Income', val: 50000 },
      { category: 'resultado líquido', val: 40000 },
      { item: 'lucro líquido', val: 30000 },
      { conta: 'prejuízo líquido', val: -20000 },
      { category: 'lucro/prejuízo do exercício', val: -15000 },
      { item: 'resultado do exercício', val: 10000 }
    ];

    aliases.forEach(aliasRow => {
      const res = extractSovereignNetIncomeWithAccount([aliasRow]);
      assert.ok(res, `Failed for row: ${JSON.stringify(aliasRow)}`);
      if (aliasRow.conta?.includes('prejuízo') || aliasRow.category?.includes('prejuízo')) {
        assert.ok(res.value < 0, `Prejuízo should be negative: ${res.value}`);
      } else {
        assert.strictEqual(res.value, aliasRow.val);
      }
    });
  });

  // Test 2: Verify negative net income is correctly preserved (not zeroed or converted to absolute)
  it('Test 2: should preserve negative sign on prejuízo accounts and not convert to absolute', () => {
    // If the database has a positive value for an account containing "prejuízo", it must be negated
    const mockPositiveLoss = [
      { conta: 'Prejuízo do Exercício', val: 68548.88 }
    ];
    const res1 = extractSovereignNetIncomeWithAccount(mockPositiveLoss);
    assert.ok(res1);
    assert.strictEqual(res1.value, -68548.88);

    // If already negative, keep it negative
    const mockNegativeLoss = [
      { conta: 'Prejuízo Líquido do Exercício', val: -68548.88 }
    ];
    const res2 = extractSovereignNetIncomeWithAccount(mockNegativeLoss);
    assert.ok(res2);
    assert.strictEqual(res2.value, -68548.88);
  });

  // Test 3: Verify validateEQENetIncomeLineage triggers EQS_NET_INCOME_LINEAGE_BREAK if there is a mismatch
  it('Test 3: should raise EQS_NET_INCOME_LINEAGE_BREAK on DRE/DFC net income mismatch', async () => {
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
    
    // Mismatch: DRE has 50000, DFC extracts 40000 from mockHistory
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

    const dfcRes = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(dfcRes.success, true);
    
    const violations = dfcRes.violations || [];
    const hasLineageBreak = violations.some(v => v.rule === 'EQS_NET_INCOME_LINEAGE_BREAK');
    assert.strictEqual(hasLineageBreak, true, 'Should raise EQS_NET_INCOME_LINEAGE_BREAK');
  });

  // Test 4: Verify LOSS_WITH_CASH_CONSUMPTION is generated instead of Profit Without Cash under negative net income
  it('Test 4: should trigger LOSS_WITH_CASH_CONSUMPTION and not PROFIT_WITHOUT_CASH when net income is negative and FCO is negative', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: -10000 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 5000 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -5000 }, // negative FCO
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 0 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 0 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 20000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 }
    ];

    const context = buildBaseContext(mockHistory);
    context.inferences['LegacyDREAdapter'] = {
      domain: 'Operational Governance',
      metrics: {
        lucroLiq: -10000,
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
    const hasLossWithCash = violations.some(v => v.rule === 'LOSS_WITH_CASH_CONSUMPTION');
    const hasProfitWithoutCash = violations.some(v => v.rule === 'PROFIT_WITHOUT_CASH');
    
    assert.strictEqual(hasLossWithCash, true, 'Should trigger LOSS_WITH_CASH_CONSUMPTION');
    assert.strictEqual(hasProfitWithoutCash, false, 'Should NOT trigger PROFIT_WITHOUT_CASH');
  });

  // Test 5: Verify FLIF catches source/consumed/rendered divergence
  it('Test 5: should trigger FLIF UI_RENDER_MISMATCH when renderingPayload diverges from engine net income', async () => {
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
        lucroLiq: -68548.88
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
        lucroLiquido: -68548.88,
        fiduciary: {
          earningsQuality: {
            netIncome: -68548.88
          }
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
        NET_INCOME_EQE: -50000 // Divergent
      }
    };

    const flifRes = await FinancialLineageIntegrityAdapter.execute(context);
    assert.strictEqual(flifRes.success, true);

    const violations = flifRes.violations || [];
    const hasRenderMismatch = violations.some(v => v.rule === 'UI_RENDER_MISMATCH');
    assert.strictEqual(hasRenderMismatch, true, 'Should trigger UI_RENDER_MISMATCH on NET_INCOME_EQE divergence');
  });

  // Test 6: Validate Granatum 2022 dataset expected output
  it('Test 6: Granatum 2022 expected balances and lineage status are consistent', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'Receita Líquida', val: 382483.91 },
      { year: 2022, docType: 'dre', category: 'lucro/prejuízo do exercício', val: -68548.88 }, // semantic negative loss
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 6935.93 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 14037.70 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo Operacional', val: 7101.77 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 6935.93 }
    ];

    const context = buildBaseContext(mockHistory);
    
    // Mock DRE matching sovereign value
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

    // Execute DFC
    const dfcRes = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(dfcRes.success, true);

    const dfcMetrics = dfcRes.inference?.metrics;
    assert.strictEqual(dfcMetrics?.fiduciary.netIncome, -68548.88);
    assert.strictEqual(dfcMetrics?.fiduciary.earningsQuality.netIncome, -68548.88);

    // Mock other adapters for FLIF execution
    context.inferences['LegacyFinancialAdapter'] = {
      domain: 'Financial',
      metrics: {
        bpSummary: {
          caixaEquivalentes: 14037.70,
          capitalSocial: 100000
        }
      },
      causality: [],
      narrative: null,
      confidence: 'HIGH',
      evidenceLevel: 'Test',
      score: 100
    };
    context.inferences['LegacyDFCAdapter'] = dfcRes.inference!;

    const flifRes = await FinancialLineageIntegrityAdapter.execute(context);
    assert.strictEqual(flifRes.success, true);

    // Check no critical net income lineage breaks exist
    const violations = flifRes.violations || [];
    const hasNetIncomeBreak = violations.some(v => v.rule === 'EQS_NET_INCOME_LINEAGE_BREAK');
    assert.strictEqual(hasNetIncomeBreak, false, 'Net income lineage must be consistent and compliant');
  });

});
