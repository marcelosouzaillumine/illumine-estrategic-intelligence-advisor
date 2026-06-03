import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('DFC Reconciliation & CQS/EQE Stabilization Corrections (v1.2)', () => {

  it('1. Deve disparar DFC_RECONCILIATION_MISMATCH sob descompasso entre BP e DFC e respeitar threshold relativo de ativoTotal', async () => {
    // Caso A: Pequeno descompasso (ex: R$ 5) em empresa com Ativo Total de R$ 1.000.000
    // Ativo * 0.0001 = 100. Como a diferença é menor que max(1, 100), não deve disparar.
    const mockHistoryNoMismatch = [
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 10000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 15000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 5000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 15005 }, // Gap de R$ 5
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 300000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }
    ];

    const contextA: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistoryNoMismatch },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const resultA = await LegacyDFCAdapter.execute(contextA);
    assert.strictEqual(resultA.success, true);
    assert.ok(!resultA.violations.some(v => v.rule === 'DFC_RECONCILIATION_MISMATCH'), "Não deveria disparar mismatch para descompasso irrelevante");

    // Caso B: Grande descompasso (ex: R$ 200) que supera o threshold de max(1, 100)
    const mockHistoryWithMismatch = [
      { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', val: 10000 },
      { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', val: 15000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 5000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 15200 }, // Gap de R$ 200 (> 100)
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 300000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 1000000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }
    ];

    const contextB: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistoryWithMismatch },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };

    const resultB = await LegacyDFCAdapter.execute(contextB);
    assert.strictEqual(resultB.success, true);
    assert.ok(resultB.violations.some(v => v.rule === 'DFC_RECONCILIATION_MISMATCH'), "Deveria disparar mismatch para descompasso relevante");
  });

  it('2. Deve aplicar a regra de EBITDA conversion display threshold relativo à Receita Líquida', async () => {
    // Caso A: EBITDA de 4.500 em empresa com Receita Líquida de 100.000 (ebitda < 2% de receita -> ebitdaThreshold = 2000. 4500 >= 2000 -> OK)
    // Caso B: EBITDA de 4.500 em empresa com Receita Líquida de 300.000 (ebitda < 2% de receita -> ebitdaThreshold = 6000. 4500 < 6000 -> NOT_APPLICABLE/SEVERE_DETERIORATION)
    const mockHistoryA = [
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 6000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 3000 }
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
    assert.strictEqual(resultA.success, true);
    assert.strictEqual(resultA.inference?.metrics.fiduciary.conversaoEbitdaCaixaStatus, 'NORMAL');

    const mockHistoryB = [
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: -10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 4500 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 3000 }
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
    assert.strictEqual(resultB.success, true);
    // Como FCO real é negativo, deve ser SEVERE_DETERIORATION
    assert.strictEqual(resultB.inference?.metrics.fiduciary.conversaoEbitdaCaixaStatus, 'SEVERE_DETERIORATION');
  });

  it('3. Deve emitir PROFIT_WITHOUT_CASH se netIncome > 0 e fcoOperacionalReal < 0', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Fluxo Operacional', val: -15000 }, // FCO < 0
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 20000 } // Lucro > 0
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
    assert.ok(result.violations.some(v => v.rule === 'PROFIT_WITHOUT_CASH'), "Deve emitir violação PROFIT_WITHOUT_CASH");
    assert.ok(result.inference?.metrics.fiduciary.earningsQuality.alerts.includes("PROFIT_WITHOUT_CASH"), "Alerts do EQS devem conter PROFIT_WITHOUT_CASH");
  });

  it('4. Deve normalizar e traduzir as mensagens de governança e alertas para Português', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: -40000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 150000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuos Sócios', val: 35000 }, // 35k / 150k > 20%
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -5000 }
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

    const warnings = result.inference?.metrics.fiduciary.governanceWarnings || [];
    assert.ok(warnings.includes("Identificada dependência relevante de acionistas/sócios."));
    assert.ok(!warnings.some((w: string) => w.includes("shareholder dependency")));
  });

  it('5. Deve mapear a confiança longitudinal corretamente com base nos ciclos históricos do input', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 }
    ];

    // Caso 1 ciclo -> LOW_CONFIDENCE
    const context1: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 1,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };
    const result1 = await LegacyDFCAdapter.execute(context1);
    assert.strictEqual(result1.inference?.metrics.fiduciary.earningsQuality.confidence, 'LOW_CONFIDENCE');

    // Caso 2 ciclos -> MODERATE_CONFIDENCE
    const context2: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 2,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };
    const result2 = await LegacyDFCAdapter.execute(context2);
    assert.strictEqual(result2.inference?.metrics.fiduciary.earningsQuality.confidence, 'MODERATE_CONFIDENCE');

    // Caso 3 ciclos -> HIGH_CONFIDENCE
    const context3: InstitutionalContext = {
      input: {
        rawFinancialData: { filterYear: 2023, allHistoryData: mockHistory },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {}, inferences: {}, globalConfidence: 'HIGH', violations: [], executedEngines: [], executionStatus: 'PENDING'
    };
    const result3 = await LegacyDFCAdapter.execute(context3);
    assert.strictEqual(result3.inference?.metrics.fiduciary.earningsQuality.confidence, 'HIGH_CONFIDENCE');
  });

  it('6. Deve gerar as seções de Conciliação Fiduciária e Qualidade da Evidência no Board Pack', async () => {
    // Mock de output de inteligência
    const mockReport: any = {
      institutionalContext: {
        currentCycle: '2023',
        tenantId: 'tenant-test-123'
      },
      inferences: {
        LegacyDFCAdapter: {
          domain: 'Inteligência de Caixa (DFC)',
          metrics: {
            fiduciary: {
              caixaInicialReal: 10000,
              caixaFinalReal: 15000,
              variacaoLiquidaConciliada: 5000,
              reconciliationGap: 0,
              reconciliationMismatch: false,
              conversaoEbitdaCaixaStatus: 'OK',
              cashQuality: {
                score: 85,
                level: 'Institutional Grade Cash',
                alerts: []
              },
              earningsQuality: {
                score: 90,
                level: 'Institutional Grade Earnings',
                confidence: 'HIGH_CONFIDENCE',
                alerts: ['PROFIT_WITHOUT_CASH']
              }
            }
          }
        }
      }
    };

    const docOutput = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport, 'BOARD');
    assert.strictEqual(docOutput.status, 'COMPLETE');
    
    const sections = docOutput.markdownSections;
    assert.ok(sections.fiduciaryReconciliationValidation);
    assert.ok(sections.financialEvidenceQuality);

    assert.ok(sections.fiduciaryReconciliationValidation.includes('Validação de Conciliação Fiduciária'));
    assert.ok(sections.fiduciaryReconciliationValidation.includes('Conciliado fiduciosamente'));
    
    assert.ok(sections.financialEvidenceQuality.includes('Qualidade da Evidência Financeira'));
    assert.ok(sections.financialEvidenceQuality.includes('PROFIT_WITHOUT_CASH'));
  });

});
