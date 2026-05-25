import { describe, it } from 'node:test';
import assert from 'node:assert';
import { evaluateTemporalCausality, HistoricalPeriodData, TemporalPatternName } from '../src/core/intelligence/temporal-causality-engine';
import { FinancialMetrics } from '../src/lib/financial-engine';
import { BPSummary } from '../src/lib/bpEngine';

// Helpers to mock period data easily
const createMockData = (
  year: number,
  ebitda: number,
  caixa: number,
  lucro: number,
  divida: number,
  estoque: number,
  pl: number = 1000
): HistoricalPeriodData => ({
  year,
  bp: {
    passivosFinanceiros: divida,
    estoques: estoque,
    patrimonioLiquido: pl,
    ativoTotal: 1000, ativoCirculante: 500, disponibilidades: caixa, clientes: 100, imobilizado: 100, intangivel: 0,
    passivoTotal: 1000, passivoCirculante: 500, passivoNaoCirculante: 0, patrimonioLiquidoEfetivo: pl, fornecedores: 100,
    emprestimosCP: divida / 2, emprestimosLP: divida / 2
  } as unknown as BPSummary,
  metrics: {
    ebitda,
    saldoTesouraria: caixa,
    lucroLiquido: lucro,
    ncg: 100,
    hasData: true
  } as unknown as FinancialMetrics
});

describe('TEMPORAL CAUSALITY ENGINE - PHASE 2 GOLDEN DATASETS', () => {

  it('[DATASET 1] Real Recovery (Turnaround Estrutural)', () => {
    const history = [
      createMockData(2022, -100, 50, -200, 300, 100),
      createMockData(2023, -20, 50, -50, 300, 100),
      createMockData(2024, 150, 200, 50, 280, 100)
    ];

    const result = evaluateTemporalCausality(history);

    assert.strictEqual(result.temporalMode, 'FULL_TEMPORAL_MODE');
    assert.strictEqual(result.isTurnaroundEmerging, true);
    
    const hasRecovery = result.recoveryPatterns.some(p => p.name === TemporalPatternName.STRUCTURAL_RECOVERY);
    assert.ok(hasRecovery, 'Deve identificar padrão REC_TURNAROUND_EMERGING');
    
    // Check Inflection Points
    const hasEbitdaReversal = result.inflectionPoints.some(i => i.indicator === 'EBITDA' && i.type === 'REVERSAL_TO_POSITIVE');
    assert.ok(hasEbitdaReversal, 'Deve identificar reversão de EBITDA');
  });

  it('[DATASET 2] Destructive Growth (Crescimento Destrutivo)', () => {
    const history = [
      createMockData(2022, 500, 300, 200, 100, 100),
      createMockData(2023, 400, 100, 100, 500, 150),
      createMockData(2024, 100, -100, -50, 1000, 300)
    ];

    const result = evaluateTemporalCausality(history);

    assert.strictEqual(result.isDestructiveGrowth, true);
    
    const hasDestructive = result.riskPatterns.some(p => p.name === TemporalPatternName.DESTRUCTIVE_GROWTH);
    assert.ok(hasDestructive, 'Deve identificar risco crítico de Crescimento Destrutivo');
  });

  it('[DATASET 3] Artificial Improvement by Debt (Melhora Artificial / Recurrent Dependency)', () => {
    const history = [
      createMockData(2022, -100, 50, -100, 100, 100),
      createMockData(2023, -150, 60, -150, 300, 100),
      createMockData(2024, -200, 70, 50, 500, 100) // Lucro sobe, EBITDA cai, dívida financia o caixa
    ];

    const result = evaluateTemporalCausality(history);

    const hasArtificial = result.riskPatterns.some(p => p.name === TemporalPatternName.ARTIFICIAL_IMPROVEMENT);
    const hasDependency = result.riskPatterns.some(p => p.name === TemporalPatternName.RECURRENT_EXTERNAL_DEPENDENCY);
    
    assert.ok(hasArtificial, 'Deve identificar Melhora Artificial devido ao lucro não operacional');
    assert.ok(hasDependency, 'Deve identificar Dependência Recorrente de Capital Externo');
  });

  it('[DATASET 4] Slow Deterioration (Deterioração Progressiva)', () => {
    const history = [
      createMockData(2022, 500, 300, 200, 100, 100),
      createMockData(2023, 300, 200, 100, 250, 100),
      createMockData(2024, 100, 100, 0, 400, 100)
    ];

    const result = evaluateTemporalCausality(history);

    const hasProgressiveDet = result.riskPatterns.some(p => p.name === TemporalPatternName.PROGRESSIVE_DETERIORATION);
    assert.ok(hasProgressiveDet, 'Deve identificar Deterioração Progressiva');
  });

  it('[DATASET 5] Abrupt Collapse (Colapso Abrupto)', () => {
    const history = [
      createMockData(2022, 500, 1000, 200, 100, 100, 2000),
      createMockData(2023, 400, 150, -100, 1000, 100, 800) // Caixa caiu de 1000 pra 150 (menos de 20%) e PL de 2000 pra 800
    ];

    const result = evaluateTemporalCausality(history);

    const hasAbruptCollapse = result.riskPatterns.some(p => p.name === TemporalPatternName.ABRUPT_COLLAPSE);
    assert.ok(hasAbruptCollapse, 'Deve identificar Colapso Abrupto');
  });

  it('[DATASET 6] Stable Company (Empresa Estável)', () => {
    const history = [
      createMockData(2022, 1000, 500, 500, 200, 100),
      createMockData(2023, 1100, 600, 550, 180, 100),
      createMockData(2024, 1050, 650, 520, 150, 100)
    ];

    const result = evaluateTemporalCausality(history);

    const hasStabilization = result.recoveryPatterns.some(p => p.name === TemporalPatternName.STABILIZATION);
    assert.ok(hasStabilization, 'Deve identificar Estabilização');
    assert.strictEqual(result.riskPatterns.length, 0, 'Não deve apontar riscos severos em empresa estável');
  });

  it('[DATASET 7] Insufficient History (Histórico Insuficiente)', () => {
    const history = [
      createMockData(2024, 1000, 500, 500, 200, 100)
    ];

    const result = evaluateTemporalCausality(history);

    assert.strictEqual(result.temporalMode, 'LIMITED_TEMPORAL_MODE');
    assert.strictEqual(result.confidence, 'LOW');
    assert.strictEqual(result.trendSignals.length, 0);
  });

});
