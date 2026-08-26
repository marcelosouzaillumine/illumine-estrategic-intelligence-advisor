import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EconomicNormalizationAdapter } from '../src/runtime/adapters/EconomicNormalizationAdapter';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext, EngineExecutionResult } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('Economic Normalization Engine (ENE) - Fiduciary & Interpretation Tests', () => {

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
    // 1. Run Financial
    const finRes = await LegacyFinancialAdapter.execute(context);
    context.inferences['LegacyFinancialAdapter'] = finRes.inference!;
    
    // 2. Run DRE
    const dreRes = await LegacyDREAdapter.execute(context);
    context.inferences['LegacyDREAdapter'] = dreRes.inference!;

    // 3. Run DFC
    const dfcRes = await LegacyDFCAdapter.execute(context);
    context.inferences['LegacyDFCAdapter'] = dfcRes.inference!;

    // 4. Run ENE
    const eneRes = await EconomicNormalizationAdapter.execute(context);
    context.inferences['EconomicNormalizationAdapter'] = eneRes.inference!;

    return {
      LegacyFinancialAdapter: finRes,
      LegacyDREAdapter: dreRes,
      LegacyDFCAdapter: dfcRes,
      EconomicNormalizationAdapter: eneRes
    };
  };

  it('1. Deve calcular pontuação e normalizações corretas de EBITDA, Giro e ROIC para caso padrão', async () => {
    const mockHistory = [
      // Balanço Patrimonial 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Clientes', val: 80000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 40000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuo Sócios', val: 10000 }, // Créditos Sócios
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Fornecedores', val: 30000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Empréstimos Sócios', val: 15000 }, // Passivos Artificiais
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 40000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 300000 },

      // Balanço Patrimonial 2022
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 40000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 450000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 90000 },

      // DRE 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 80000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 45000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 10000 },
      { year: 2023, docType: 'dre', category: 'Ganho não recorrente', val: 12000 }, // Receitas Não Recorrentes

      // DFC 2023
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 60000 }
    ];

    const context = buildBaseContext(mockHistory);
    const results = await runAllEngines(context);

    assert.strictEqual(results.EconomicNormalizationAdapter.success, true);
    
    const eneMetrics = results.EconomicNormalizationAdapter.inference?.metrics;
    assert.ok(eneMetrics);

    // EBITDA Normalization Checks
    assert.strictEqual(eneMetrics.ebitda.contabil, 80000);
    // EBITDA Normalizado = EBITDA_Contabil (80k) - Não Recorrentes (12k) - Partes Relacionadas (0) - Extraordinários (0) = 68k
    assert.strictEqual(eneMetrics.ebitda.normalizado, 68000);
    assert.strictEqual(eneMetrics.ebitda.recorrente, 68000);

    // Working Capital Normalization Checks
    // Capital de Giro Contábil = 200k - 100k = 100k
    assert.strictEqual(eneMetrics.workingCapital.contabil, 100000);
    // Capital de Giro Operacional Líquido Ajustado = AtivoCirculante (200k) - Estoques (40k) - CreditosSocios (10k) - PassivosArtificiais (15k) = 135k
    assert.strictEqual(eneMetrics.workingCapital.operacionalLiquidoAjustado, 135000);

    // ROIC Normalization Checks
    assert.strictEqual(eneMetrics.roic.normalizadoStatus, 'OK');
    assert.ok(eneMetrics.roic.normalizado > 0);

    // Consolidated Economic Normalization Score (ENS)
    assert.ok(eneMetrics.ensScore > 50, `ENS Score: ${eneMetrics.ensScore}`);
    assert.strictEqual(eneMetrics.isEarlyStage, false);
  });

  it('2. Deve disparar salvaguarda de ROIC não-calculável e retornar status NOT_COMPUTABLE', async () => {
    const mockHistory = [
      // Balanço Patrimonial 2023 (Capital Investido Real se torna <= 0)
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 90000 }, // High cash reduces Invested Capital
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuo Sócios', val: 50000 }, // High Related Party assets
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 5000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 10000 },

      // Balanço Patrimonial 2022
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 80000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 90000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 5000 },

      // DRE 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 50000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 5000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 2000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 1000 },

      // DFC 2023
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 2000 }
    ];

    const context = buildBaseContext(mockHistory);
    const results = await runAllEngines(context);

    assert.strictEqual(results.EconomicNormalizationAdapter.success, true);
    
    const roicMetrics = results.EconomicNormalizationAdapter.inference?.metrics.roic;
    assert.ok(roicMetrics);
    assert.strictEqual(roicMetrics.normalizadoStatus, 'NOT_COMPUTABLE');
    assert.strictEqual(roicMetrics.normalizadoReason, 'Insufficient or invalid operational invested capital base');
    assert.strictEqual(roicMetrics.normalizado, null);
    assert.strictEqual(roicMetrics.evaEconomicoReal, null);
  });

  it('3. Deve separar dívida financeira real de passivos operacionais e societários', async () => {
    const mockHistory = [
      // Balanço Patrimonial 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 20000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Fornecedores', val: 35000 }, // Passivo Operacional
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Mútuo Sócios', val: 15000 }, // Passivo Societário
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 30000 }, // Passivos Financeiros Totais

      // Balanço Patrimonial 2022
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 150000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 60000 },

      // DRE 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 150000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 15000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 5000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 2000 },

      // DFC 2023
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 3000 }
    ];

    const context = buildBaseContext(mockHistory);
    const results = await runAllEngines(context);

    assert.strictEqual(results.EconomicNormalizationAdapter.success, true);
    
    const debtMetrics = results.EconomicNormalizationAdapter.inference?.metrics.debt;
    assert.ok(debtMetrics);

    // Divida Financeira Real = Bancos e Financiamentos (30k) - Passivos Societários (15k) = 15k
    assert.strictEqual(debtMetrics.dividaFinanceiraReal, 15000);
    // Passivos Societários = 15k
    assert.strictEqual(debtMetrics.passivosSocietarios, 15000);
    // Fornecedores should not be debt, but operational
    assert.strictEqual(debtMetrics.passivosOperacionais >= 35000, true);
  });

  it('4. Deve sanitizar termos forenses proibidos utilizando termos fiduciários aprovados', async () => {
    const mockHistory = [
      // BP
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 2000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 50000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 20000 },
      
      // DFC (triggering failures / distortions to generate alert strings containing normalized text)
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -15000 },

      // DRE
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 20000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -5000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -8000 }
    ];

    const context = buildBaseContext(mockHistory);
    const results = await runAllEngines(context);

    assert.strictEqual(results.EconomicNormalizationAdapter.success, true);

    const diag = results.EconomicNormalizationAdapter.inference?.narrative?.diagnostic || '';
    assert.ok(diag);

    // Check that forensic words are absent and replaced
    assert.ok(!diag.toLowerCase().includes('manipulação'));
    assert.ok(!diag.toLowerCase().includes('fraude'));
    assert.ok(!diag.toLowerCase().includes('lucro falso'));
    assert.ok(!diag.toLowerCase().includes('economia falsa'));
    assert.ok(!diag.toLowerCase().includes('terminal failure'));
    assert.ok(!diag.toLowerCase().includes('irreversible collapse'));
  });

  it('5. Deve aplicar atenuação de penalidade no score econômico para empresas early-stage', async () => {
    const mockHistory = [
      // Balanço Patrimonial 2023 (Pessimo giro e relacionados, mas com cycles < 3)
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuo Sócios', val: 60000 }, // Related Party credits > 15%
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      
      // DRE 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 50000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 5000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 1000 },

      // DFC 2023
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 2000 }
    ];

    const context = buildBaseContext(mockHistory, 2); // 2 cycles => early-stage
    const results = await runAllEngines(context);

    assert.strictEqual(results.EconomicNormalizationAdapter.success, true);
    
    const metrics = results.EconomicNormalizationAdapter.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.isEarlyStage, true);

    // Working capital score normally would be heavily penalized (starts at 100, -30 for mútuo sócios).
    // Under early-stage protection, all scores are capped at a minimum of 70 to prevent extreme penalties.
    assert.strictEqual(metrics.workingCapital.pureViewModel.score >= 70, true);
  });

  it('6. Deve integrar todas as 6 seções ENE requeridas no Board Pack', async () => {
    // Build a complete dummy report object
    const mockReport: any = {
      institutionalContext: { currentCycle: '2023.Q4', tenantId: 'tenant-test' },
      inferences: {
        BoardRiskMatrixAdapter: {
          metrics: {
            boardRiskScore: 80,
            institutionalIntegrityLevel: 'Resilient Structure',
            bankingReadinessScore: 85,
            bankingReadinessLevel: 'Institutional Banking Grade',
            alerts: [],
            dimensions: { treasury: 80, earnings: 80, survivability: 80, governance: 80, capital: 80, stability: 80 },
            divergence: { cqs: 80, eqs: 80, divergenceScore: 0 }
          }
        },
        EconomicNormalizationAdapter: {
          metrics: {
            ensScore: 90,
            ensLevel: 'Highly Normalized Institutional Economics',
            ebitda: { contabil: 10000, operacionalReal: 9500, recorrente: 9800, normalizado: 9300, score: 95 },
            workingCapital: { contabil: 20000, operacionalLiquidoAjustado: 18000, liquidezAjustada: 1.25, dependenciaGiro: 0.15, score: 92 },
            roic: { contabil: 0.15, normalizado: 0.12, normalizadoStatus: 'OK', evaContabil: 1500, evaEconomicoReal: 1200, score: 90 },
            debt: { dividaFinanceiraReal: 5000, passivosOperacionais: 12000, passivosSocietarios: 0, passivosArtificiais: 0, pressaoCurtoPrazo: 0.2, dependenciaRefinanciamento: 0.1, score: 95 },
            margin: { margemEbitdaReal: 0.18, margemOperacionalAjustada: 0.14, margemRecorrente: 0.16, pressaoEstruturalCustos: 0.22, score: 94 },
            stability: { lossCyclesCount: 0, ebitdaVol: 0.05, score: 95 },
            alerts: ['Reported EBITDA demonstrates material dependency on non-recurring economic effects.'],
            isEarlyStage: false,
            auditability: {
              ebitda: { reconciliationTrace: 'Trace ebitda', reconstructionLogic: 'Logic ebitda', lineage: 'Lineage ebitda', fiduciaryRationale: 'Rationale ebitda' },
              workingCapital: { reconciliationTrace: 'Trace wc', reconstructionLogic: 'Logic wc', lineage: 'Lineage wc', fiduciaryRationale: 'Rationale wc' },
              roic: { reconciliationTrace: 'Trace roic', reconstructionLogic: 'Logic roic', lineage: 'Lineage roic', fiduciaryRationale: 'Rationale roic' }
            }
          },
          narrative: {
            diagnostic: 'Diagnostic test text',
            cause: 'Cause test text',
            consequence: 'Consequence test text',
            sensitivity: 'Sensitivity test text',
            risk: 'Risk test text'
          }
        }
      }
    };

    const doc = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport, 'BOARD');
    assert.strictEqual(doc.status, 'COMPLETE');
    
    const sections = doc.markdownSections;
    
    // Assert all 6 sections are populated
    assert.ok(sections.economicNormalizationSummary);
    assert.ok(sections.normalizedEbitdaReport);
    assert.ok(sections.workingCapitalIntegrityReport);
    assert.ok(sections.normalizedRoicEvaAnalysis);
    assert.ok(sections.structuralDistortionReport);
    assert.ok(sections.fiduciaryEconomicInterpretationSummary);

    // Verify presence of renamed metric in Working Capital
    assert.ok(sections.workingCapitalIntegrityReport.includes('Capital de Giro Operacional Líquido Ajustado'));
    assert.ok(sections.workingCapitalIntegrityReport.includes('Capital de Giro Contábil'));
  });

});
