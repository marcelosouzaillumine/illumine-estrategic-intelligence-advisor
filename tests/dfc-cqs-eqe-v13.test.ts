import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('DFC / CQS / EQE Structural Reconciliation Stabilization (v1.3)', () => {

  it('Teste 1: Variação Líquida Conciliada = Caixa Final BP - Caixa Inicial BP', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 8000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 12000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 4000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 15000 }, // Caixa Final BP = 15000
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }  // Caixa Inicial BP = 10000
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    // Variacão Líquida Conciliada deve ser exatamente 15000 - 10000 = 5000
    assert.strictEqual(result.inference?.metrics.fiduciary.variacaoLiquidaConciliada, 5000);
  });

  it('Teste 2: DFC_RECONCILIATION_MISMATCH é emitido corretamente', async () => {
    // Caso com gap que excede o threshold
    const mockHistoryMismatch = [
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 10000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 18000 }, // var = 8000
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 8000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 12000 }, // Final real = 12000, gap = |18000 - 12000| = 6000
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 50000 }, // threshold = max(1, 5) = 5
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistoryMismatch },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.ok(result.violations.some(v => v.rule === 'DFC_RECONCILIATION_MISMATCH'));
  });

  it('Teste 3: Lucro Líquido EQE = Lucro Líquido DRE', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 75000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 40000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics.fiduciary.netIncome, 75000);
  });

  it('Teste 4: Bloqueio de valores de conversão absurdos (-5000%, -8000%, etc)', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 500000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 4000 }, // ebitda = 4000 < threshold (max(5000, 10000) = 10000)
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: -150000 }, // FCO negativo
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 60000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    const display = result.inference?.metrics.fiduciary.cashConversionDisplay;
    
    assert.strictEqual(display.status, 'SEVERE_DETERIORATION');
    assert.strictEqual(display.value, null);
    assert.strictEqual(display.label, 'Conversão Severamente Deteriorada');
  });

  it('Teste 5: Renderização de "Não Aplicável" e "Conversão Severamente Deteriorada"', async () => {
    // Caso A: FCO positivo ou zero com ebitda próximo de zero -> NOT_APPLICABLE
    const mockHistoryA = [
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 200000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 1000 }, // < threshold (5000)
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 10000 }, // FCO positivo
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 }
    ];

    const contextA: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistoryA },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const resultA = await LegacyDFCAdapter.execute(contextA);
    assert.strictEqual(resultA.inference?.metrics.fiduciary.cashConversionDisplay.status, 'NOT_APPLICABLE');
    assert.strictEqual(resultA.inference?.metrics.fiduciary.cashConversionDisplay.label, 'Não Aplicável');

    // Caso B: FCO negativo com ebitda próximo de zero -> SEVERE_DETERIORATION
    const mockHistoryB = [
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 200000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 1000 }, // < threshold (5000)
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: -10000 }, // FCO negativo
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 }
    ];

    const contextB: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistoryB },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const resultB = await LegacyDFCAdapter.execute(contextB);
    assert.strictEqual(resultB.inference?.metrics.fiduciary.cashConversionDisplay.status, 'SEVERE_DETERIORATION');
    assert.strictEqual(resultB.inference?.metrics.fiduciary.cashConversionDisplay.label, 'Conversão Severamente Deteriorada');
  });

  it('Teste 6: Validação da consistência: BP, DRE, DFC, CQS, EQE em clientes distintos', async () => {
    // Cliente 1: Consistente e Completo
    const client1History = [
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 1000000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 250000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 150000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 100000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 200000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1500000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 100000 }
    ];

    const context1: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: client1History },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result1 = await LegacyDFCAdapter.execute(context1);
    assert.strictEqual(result1.success, true);
    assert.strictEqual(result1.inference?.metrics.fiduciary.bpSourceStatus, 'Consistente');
    assert.strictEqual(result1.inference?.metrics.fiduciary.reconciliationMismatch, false);

    // Cliente 2: Reconstrução Parcial (BP Anterior ausente)
    const client2History = [
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 500000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 60000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 50000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 80000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 30000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 80000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 800000 }
      // Sem BP 2022
    ];

    const context2: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: client2History },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result2 = await LegacyDFCAdapter.execute(context2);
    assert.strictEqual(result2.success, true);
    assert.strictEqual(result2.inference?.metrics.fiduciary.bpSourceStatus, 'Limitada');
  });

  it('Teste 7: BP cash extraction strictly from Disponível/Bancos/Aplicações under Ativo and Safeguard 2 (No Double Counting)', async () => {
    const mockHistory = [
      // DRE entry to satisfy indirect method prerequisites
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 1000 },
      // Balanço 2023 with double counting structure (Disponível has children)
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Disponível', val: 14037.70 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa', val: 10000.00 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Bancos', val: 4037.70 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 },
      
      // Previous year
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Disponível', val: 6935.93 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa', val: 5000.00 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Bancos', val: 1935.93 },
      
      // Passive account named "Banco de Empréstimos" to ensure it's NOT matched as cash (Safeguard 1)
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Banco de Empréstimos', val: 80000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    // Final cash must be exactly 14,037.70, not double-counted (e.g. 14037.70 + 10000 + 4037.70 = 28075.40)
    assert.strictEqual(result.inference?.metrics.fiduciary.caixaFinalReal, 14037.70);
    assert.strictEqual(result.inference?.metrics.fiduciary.caixaInicialReal, 6935.93);
  });

  it('Teste 8: variacaoLiquidaConciliada equals BP final cash minus initial cash directly', async () => {
    const mockHistory = [
      // DRE entry to satisfy indirect method prerequisites
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 1000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa', val: 6935.93 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics.fiduciary.variacaoLiquidaConciliada, 7101.77);
  });

  it('Teste 9: EQE card displays DRE net income including negative value', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'lucroPrejuizoDoExercicio', val: -68548.88 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa', val: 6935.93 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics.fiduciary.netIncome, -68548.88);
  });

  it('Teste 10: Granatum 2022 reconciliation gap equals zero', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 6935.93 },
      { year: 2022, docType: 'dfc', conta: 'Fluxo Operacional', val: 7101.77 },
      { year: 2022, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 14037.70 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2021, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 6935.93 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2022, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics.fiduciary.reconciliationGap, 0.00);
    assert.strictEqual(result.inference?.metrics.fiduciary.reconciliationMismatch, false);
  });

});
