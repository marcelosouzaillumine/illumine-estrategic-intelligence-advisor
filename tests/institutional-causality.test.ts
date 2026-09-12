import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalCausalityExplorer } from '../src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer';
import { HistoricalRuntimeCycle } from '../src/workspace/runtime/executive-timeline/executive-timeline-types';
import { InstitutionalCausalityOrchestrator } from '../src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator';
import { ExecutiveNarrativeSanitizer, FiduciaryNarrativeViolation } from '../src/core/runtime/institutional-causality/ExecutiveNarrativeSanitizer';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { HistoricalCycleData } from '../src/core/runtime/institutional-memory/types';
import { LOW_CONFIDENCE, HIGH_CONFIDENCE } from '../src/core/runtime/institutional-causality/types';
import { CalibrationEngine } from '../src/core/runtime/calibration/CalibrationEngine';

describe('Institutional Causality Graph & Longitudinal Governance Layer (RC-1.3) Suite', () => {
  beforeEach(() => {
    CalibrationEngine.resetToDefault();
  });
  
  it('1. Deve forçar fail-closed para histórico insuficiente (< 3 ciclos)', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2024, scores: { composite: 80 } },
      { year: 2025, scores: { composite: 75 } }
    ];

    const result = InstitutionalCausalityOrchestrator.evaluate(cycles);
    assert.equal(result.historicalDensityRequirement, 'INSUFFICIENT');
    assert.equal(result.confidenceProfile.globalConfidence, LOW_CONFIDENCE);
    assert.equal(result.confidenceProfile.temporalConfidence, 0.0);
    assert.equal(result.confidenceProfile.evidenceDensityConfidence, 0.0);
    assert.strictEqual(result.narrative, 'Base histórica limítrofe, insuficiente para inferências longitudinais.');
    assert.deepEqual(result.sequences, []);
    assert.deepEqual(result.propagationVectors, []);
    assert.deepEqual(result.graph.nodes, []);
  });

  it('2. Deve lançar FiduciaryNarrativeViolation se termo proibido for detectado', () => {
    assert.throws(() => {
      ExecutiveNarrativeSanitizer.sanitize('O declínio de liquidez causou o estresse financeiro.');
    }, (err: any) => err instanceof FiduciaryNarrativeViolation && err.message.includes('causou'));

    assert.throws(() => {
      ExecutiveNarrativeSanitizer.sanitize('Isso evidencia falha na gestão.');
    }, (err: any) => err instanceof FiduciaryNarrativeViolation && err.message.includes('evidencia falha'));

    assert.throws(() => {
      ExecutiveNarrativeSanitizer.sanitize('A gestão falhou no controle do capital de giro.');
    }, (err: any) => err instanceof FiduciaryNarrativeViolation && err.message.includes('gestão falhou'));

    const safeText = 'O acúmulo de estoques precedeu a queda de liquidez imediata.';
    assert.equal(ExecutiveNarrativeSanitizer.sanitize(safeText), safeText);
  });

  it('3. Deve construir grafo com arestas de associação permitidas e ausência de causação direta', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 100 },
          { code: '1.1.2', accountName: 'Estoque', value: 100 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 100 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2024,
        scores: { composite: 75 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 90 },
          { code: '1.1.2', accountName: 'Estoque', value: 120 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 120 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2025,
        scores: { composite: 70 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 50 },
          { code: '1.1.2', accountName: 'Estoque', value: 150 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 150 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      }
    ];

    const profile = InstitutionalCausalityOrchestrator.evaluate(cycles);
    assert.equal(profile.historicalDensityRequirement, 'SUFFICIENT');
    assert.ok(profile.graph.edges.length > 0);

    const allowedTypes = ['TEMPORAL_PRECEDENCE', 'RECURRING_ASSOCIATION', 'STRUCTURAL_PROPAGATION', 'FIDUCIARY_RECURRENCE', 'OBSERVED_CO_OCCURRENCE'];
    for (const edge of profile.graph.edges) {
      assert.ok(allowedTypes.includes(edge.relationType), `Tipo de relação proibido: ${edge.relationType}`);
      assert.notEqual(edge.relationType, 'DIRECT_CAUSATION');
      assert.notEqual(edge.relationType, 'ROOT_CAUSE');
    }
  });

  it('4. Deve repriorizar recomendações no priority focus quando houver estresse longitudinal', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 10 },
          { code: '1.1.2', accountName: 'Estoque', value: 100 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 100 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2024,
        scores: { composite: 75 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 10 },
          { code: '1.1.2', accountName: 'Estoque', value: 120 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 120 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2025,
        scores: { composite: 70 },
        bpData: [
          { code: '1.1.1', accountName: 'Caixa', value: 10 },
          { code: '1.1.2', accountName: 'Estoque', value: 150 },
          { code: '2.1.1', accountName: 'Fornecedores', value: 150 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      }
    ];

    const payload = {
      isMockData: false,
      historicalCyclesCount: 3,
      runtimeHistory: cycles,
      metadata: {
        lineageHash: 'VALID-CAUSALITY-TEST-HASH'
      },
      compliance: {
        confidenceLevel: 'HIGH_CONFIDENCE'
      },
      rawFinancialData: {
        segmentoEmpresa: 'Varejo',
        bpSummary: {
          ativoTotal: 1000,
          ativoCirculante: 500,
          passivoCirculante: 400,
          passivoTotal: 600,
          patrimonioLiquido: 400,
          caixaEquivalentes: 50,
          estoques: 150
        }
      },
      bpData: [
        { code: '1.1.1', accountName: 'Caixa', value: 50 },
        { code: '1.1.2', accountName: 'Estoque', value: 150 },
        { code: '2.1.1', accountName: 'Fornecedores', value: 400 }
      ],
      dreData: [
        { category: 'receitaLiquida', type: 'dre', value: 100000, val: 100000 },
        { category: 'ebitda', type: 'dre', value: 20000, val: 20000 },
        { category: 'lucroLiquido', type: 'dre', value: 10000, val: 10000 }
      ]
    };

    const report = executiveRuntime.generateExecutiveReport(payload);
    assert.ok(report.institutionalCausality);
    assert.equal(report.institutionalCausality.historicalDensityRequirement, 'SUFFICIENT');
    assert.ok(report.advisory.actionMatrix.some(item => {
      const text = typeof item === 'string' ? item : (item.title || item.acao || '');
      return text.includes('Preservação e reforço imediato de liquidez estrutural');
    }));
    assert.equal(report.advisory.priorityFocus, 'Liquidez estrutural, capitalização e autonomia fiduciária.');
  });
});

describe('Institutional Causality Explorer (ICE) v1.0 Tests', () => {

  const getBaseCycle = (ref: string): HistoricalRuntimeCycle => ({
    cycleReference: ref,
    compositeScore: 70,
    ebitda: 200000,
    netIncome: 100000,
    ocf: 150000,
    cashEquivalents: 300000,
    equity: 1000000,
    totalDebt: 500000,
    workingCapital: 100000,
    fiduciaryClassification: 'HEALTHY',
    lineageHash: `hash_${ref}`,
    isQuarantined: false,
    isRestricted: false
  });

  it('Test 1: Operational chain - EBITDA decline and net income compression', () => {
    const c1 = { ...getBaseCycle('2025-Q1'), ebitda: 200000, netIncome: 100000 };
    const c2 = { ...getBaseCycle('2025-Q2'), ebitda: 80000, netIncome: 30000 }; // decline > 15% and net income drop

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    assert.strictEqual(output.confidenceLevel, 'LOW'); // 2 cycles
    assert.ok(output.causalChains.length > 0);
    
    const opChain = output.causalChains.find(c => c.category === 'OPERATIONAL');
    assert.ok(opChain);
    assert.strictEqual(opChain.cause, 'AUMENTO_DE_DESPESAS_ADMINISTRATIVAS');
    assert.strictEqual(opChain.driver, 'COMPRESSÃO_DE_MARGEM_LÍQUIDA');
    assert.strictEqual(opChain.effect, 'EROSÃO_DE_EBITDA');
    assert.strictEqual(opChain.severity, 'WARNING');
  });

  it('Test 2: Working Capital chain - Cycle pressure and FCO reduction', () => {
    const c1 = { ...getBaseCycle('2025-Q1'), workingCapital: 100000 };
    const c2 = { ...getBaseCycle('2025-Q2'), workingCapital: 50000 }; // wc decline

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    const wcChain = output.causalChains.find(c => c.category === 'WORKING_CAPITAL');
    assert.ok(wcChain);
    assert.strictEqual(wcChain.cause, 'DILATAÇÃO_DE_PRAZOS_DE_RECEBIMENTO');
    assert.strictEqual(wcChain.driver, 'PRESSÃO_DE_CAPITAL_DE_GIRO');
    assert.strictEqual(wcChain.effect, 'CONSUMO_DE_FLUXO_DE_CAIXA');
  });

  it('Test 3: Treasury chain - Cash depletion and operational burn', () => {
    const c1 = { ...getBaseCycle('2025-Q1'), cashEquivalents: 400000, ocf: 150000 };
    const c2 = { ...getBaseCycle('2025-Q2'), cashEquivalents: 100000, ocf: -50000 }; // Cash depleted & negative ocf

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    const treasChain = output.causalChains.find(c => c.category === 'TREASURY');
    assert.ok(treasChain);
    assert.strictEqual(treasChain.cause, 'INSUFICIÊNCIA_OPERACIONAL_DE_CAIXA');
    assert.strictEqual(treasChain.driver, 'QUEIMA_DE_CAIXA_OPERACIONAL');
    assert.strictEqual(treasChain.effect, 'RETRAÇÃO_DE_RESERVAS_DE_LIQUIDEZ');
  });

  it('Test 4: Fail closed - Quarantine state enforces restrictiveness', () => {
    const c1 = getBaseCycle('2025-Q1');
    const c2 = { ...getBaseCycle('2025-Q2'), isQuarantined: true };

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    assert.strictEqual(output.confidenceLevel, 'CAUSALITY_RESTRICTED');
    assert.strictEqual(output.primaryCause, 'CONTAMINACAO_OU_INSUFICIENCIA_DE_DADOS');
    assert.ok(output.causalChains.some(c => c.severity === 'RESTRICTIVE'));
  });

  it('Test 5: Root Cause Prioritization - Constitutional/Treasury weights override operational', () => {
    const c1 = { ...getBaseCycle('2025-Q1'), ebitda: 200000, cashEquivalents: 400000, ocf: 100000 };
    const c2 = { 
      ...getBaseCycle('2025-Q2'), 
      ebitda: 50000, // operational triggered
      netIncome: 1000, 
      cashEquivalents: 100000, // treasury triggered
      ocf: -50000
    };

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    assert.strictEqual(output.primaryCause, 'INSUFICIÊNCIA_OPERACIONAL_DE_CAIXA');
    assert.ok(output.secondaryCauses.includes('AUMENTO_DE_DESPESAS_ADMINISTRATIVAS'));
  });

  it('Test 6: Check multiple causal chains are populated', () => {
    const c1 = { ...getBaseCycle('2025-Q1'), ebitda: 200000, workingCapital: 100000 };
    const c2 = { ...getBaseCycle('2025-Q2'), ebitda: 50000, netIncome: 1000, workingCapital: 20000 };

    const output = InstitutionalCausalityExplorer.generate([c1, c2], 'MEDIUM_CONFIDENCE');

    assert.ok(output.causalChains.length >= 2);
    assert.ok(output.causalChains.some(c => c.category === 'OPERATIONAL'));
    assert.ok(output.causalChains.some(c => c.category === 'WORKING_CAPITAL'));
  });
});
