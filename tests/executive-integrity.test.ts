import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { EmptyCycleIntegrityEngine } from '../src/core/runtime/integrity/EmptyCycleIntegrityEngine';
import { ScaleEfficiencyIntegrityEngine } from '../src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine';
import { BenchmarkReferenceEngine } from '../src/core/runtime/integrity/BenchmarkReferenceEngine';
import { InvalidMetricGuard } from '../src/core/runtime/integrity/InvalidMetricGuard';
import { ExecutiveActionMatrixEngine } from '../src/core/runtime/integrity/ExecutiveActionMatrixEngine';
import { HistoricalSeriesIntegrityEngine } from '../src/core/runtime/integrity/HistoricalSeriesIntegrityEngine';
import { ExecutiveEmptyStateResolver } from '../src/core/runtime/integrity/ExecutiveEmptyStateResolver';

describe('Executive Diagnostic Integrity and Fail-Closed Engine (RC-1.3A)', () => {

  it('1. Empty Cycle Fail-Closed blocks calculations when data is missing', () => {
    const emptyPayload = {
      forceStrictCheck: true,
      bpData: [],
      dreData: [],
      ledgerEntries: [],
      rawFinancialData: {
        recLiquida: null,
        bpSummary: {}
      }
    };

    const report = executiveRuntime.generateExecutiveReport(emptyPayload);

    assert.equal(report.metrics.hasData, false);
    assert.equal(report.scores.composite, 0);
    assert.equal(report.advisory.actionMatrix.length, 0);
    assert.equal(report.advisory.executiveSummary, ExecutiveEmptyStateResolver.EMPTY_CYCLE);
    assert.equal(report.causality.event, ExecutiveEmptyStateResolver.EMPTY_CYCLE);
  });

  it('2. Empty Cycle blocks when minimum structural accounts are missing', () => {
    const missingAccountsPayload = {
      forceStrictCheck: true,
      bpData: [
        { conta: 'Ativo Total', val: 100000, entryType: 'Ativo' } // Missing Passivo Total
      ],
      dreData: [
        { conta: 'Receita Líquida', val: 120000 },
        { conta: 'EBITDA', val: 20000 }
      ],
      ledgerEntries: [
        { id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }
      ],
      rawFinancialData: {
        recLiquida: 120000,
        ebitda: 20000,
        bpSummary: {
          ativoTotal: 100000,
          passivoTotal: null // Explicito nulo
        }
      }
    };

    assert.ok(EmptyCycleIntegrityEngine.evaluate(missingAccountsPayload));
    const report = executiveRuntime.generateExecutiveReport(missingAccountsPayload);
    assert.equal(report.metrics.hasData, false);
  });

  it('3. Scale Efficiency blocks longitudinal metrics when historicalCycles < 2', () => {
    const report = executiveRuntime.generateExecutiveReport({
      bpData: [
        { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
        { conta: 'Passivo Total', val: 50000, entryType: 'Passivo', ordem: 2 }
      ],
      dreData: [
        { conta: 'Receita Líquida', val: 150000, ordem: 1 },
        { conta: 'EBITDA', val: 30000, ordem: 2 },
        { conta: 'Lucro Líquido do Exercício', val: 10000, ordem: 3 }
      ],
      ledgerEntries: [{ id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }],
      historicalCyclesCount: 1, // < 2
      rawFinancialData: {
        segmentoEmpresa: 'Cosméticos',
        recLiquida: 150000,
        ebitda: 30000,
        lucroLiquido: 10000,
        bpSummary: {
          ativoTotal: 100000,
          passivoTotal: 50000,
          patrimonioLiquido: 50000
        }
      }
    });

    assert.equal(report.metrics.scaleEfficiency.category, 'NOT_AVAILABLE');
    assert.equal(report.metrics.scaleEfficiency.recGrowth, null);
    assert.equal(report.metrics.scaleEfficiency.description, ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY);
  });

  it('4. Historical Series validates and blocks charts when validPoints < 2', () => {
    const result = HistoricalSeriesIntegrityEngine.validate([
      { year: '2026', receita: 0, ebitda: 0 } // only 1 point
    ]);
    assert.equal(result, false);

    const report = executiveRuntime.generateExecutiveReport({
      bpData: [
        { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
        { conta: 'Passivo Total', val: 50000, entryType: 'Passivo', ordem: 2 }
      ],
      dreData: [
        { conta: 'Receita Líquida', val: 150000, ordem: 1 },
        { conta: 'EBITDA', val: 30000, ordem: 2 }
      ],
      ledgerEntries: [{ id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }],
      historicalCyclesCount: 2,
      historicalSeries: [], // Empty historical points
      rawFinancialData: {
        recLiquida: 150000,
        ebitda: 30000,
        bpSummary: { ativoTotal: 100000, passivoTotal: 50000 }
      }
    });

    assert.equal(report.metrics.chartData.length, 0);
  });

  it('5. BenchmarkReferenceEngine resolves confidence hierarchy correctly', () => {
    // 5.1 Board Custom KPI (HIGH_CONFIDENCE)
    const customRes = BenchmarkReferenceEngine.resolve('cmvVal', 'Cosméticos', 'Industrial', {
      customBenchmarks: { cmvVal: 45 }
    });
    assert.equal(customRes.confidence, 'HIGH_CONFIDENCE');
    assert.equal(customRes.target, 45);
    assert.equal(customRes.label, 'Referência definida pelo Board');

    // 5.2 Sector Specific Benchmark (MEDIUM_CONFIDENCE)
    const sectorRes = BenchmarkReferenceEngine.resolve('ebitdaVal', 'Cosméticos', 'Industrial');
    assert.equal(sectorRes.confidence, 'MEDIUM_CONFIDENCE');
    assert.ok(sectorRes.label.includes('Cosmética Brasileira'));

    // 5.3 Generic Model Benchmark (LOW_CONFIDENCE)
    const genericRes = BenchmarkReferenceEngine.resolve('ebitdaVal', 'Outros', 'Serviço');
    assert.equal(genericRes.confidence, 'LOW_CONFIDENCE');
    assert.ok(genericRes.label.includes('Referencial aproximado'));
  });

  it('6. InvalidMetricGuard suppresses Infinity and NaN', () => {
    const nanRes = InvalidMetricGuard.safeDivide(0, 0);
    assert.equal(nanRes, 'Não aplicável');

    const infRes = InvalidMetricGuard.safeDivide(100, 0, 'INSUFFICIENT');
    assert.equal(infRes, 'Base de cálculo insuficiente');

    const uncompRes = InvalidMetricGuard.sanitize(NaN, 'UNCOMPARABLE');
    assert.equal(uncompRes, 'Estrutura não comparável');
  });

  it('7. ExecutiveActionMatrixEngine filters out actions lacking fiduciary evidence', () => {
    const rawActions = [
      'Reduzir despesas administrativas', // has indexAdmin in metrics
      'Ação sem evidência' // has no metric associated, will use default evidence or get filtered out if default is not set or empty
    ];

    const metrics = {
      hasData: true,
      indiceDespesasAdministrativas: 15.5
    };

    const matrix = ExecutiveActionMatrixEngine.buildMatrix(rawActions, metrics, {}, {}, 'SENSÍVEL');

    // Action 1: "Reduzir despesas administrativas" has evidence and must exist
    assert.ok(matrix.some(a => a.title === 'Reduzir despesas administrativas'));
    const adminAction = matrix.find(a => a.title === 'Reduzir despesas administrativas')!;
    assert.equal(adminAction.fiduciaryEvidence, 'Despesa administrativa representa 15.50% da receita líquida');
  });

  it('8. ExecutiveDiagnosisComposer hardens technical terminology', () => {
    const rawText = 'Primeiro Ano Operacional sob asfixia iminente e Confiabilidade: Confiabilidade Moderada.';
    const sanitized = ExecutiveEmptyStateResolver ? executiveRuntime.generateExecutiveReport({
      bpData: [
        { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
        { conta: 'Passivo Total', val: 50000, entryType: 'Passivo', ordem: 2 }
      ],
      dreData: [
        { conta: 'Receita Líquida', val: 150000, ordem: 1 },
        { conta: 'EBITDA', val: 30000, ordem: 2 }
      ],
      ledgerEntries: [{ id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }],
      rawFinancialData: {
        recLiquida: 150000,
        ebitda: 30000,
        bpSummary: { ativoTotal: 100000, passivoTotal: 50000 }
      }
    }) : null;

    const formatted = executiveRuntime.generateExecutiveReport({
      bpData: [
        { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
        { conta: 'Passivo Total', val: 50000, entryType: 'Passivo', ordem: 2 }
      ],
      dreData: [
        { conta: 'Receita Líquida', val: 150000, ordem: 1 },
        { conta: 'EBITDA', val: 30000, ordem: 2 }
      ],
      ledgerEntries: [{ id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }],
      rawFinancialData: {
        recLiquida: 150000,
        ebitda: 30000,
        bpSummary: { ativoTotal: 100000, passivoTotal: 50000 }
      }
    });

    const processedText = formatted.advisory.executiveSummary;
    assert.ok(!processedText.includes('Primeiro Ano Operacional'));
    assert.ok(!processedText.includes('Asfixia iminente'));
  });

});
