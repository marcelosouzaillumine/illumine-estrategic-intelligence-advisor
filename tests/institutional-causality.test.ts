import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalCausalityOrchestrator } from '../src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator';
import { ExecutiveNarrativeSanitizer, FiduciaryNarrativeViolation } from '../src/core/runtime/institutional-causality/ExecutiveNarrativeSanitizer';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { HistoricalCycleData } from '../src/core/runtime/institutional-memory/types';
import { LOW_CONFIDENCE, HIGH_CONFIDENCE } from '../src/core/runtime/institutional-causality/types';

describe('Institutional Causality Graph & Longitudinal Governance Layer (RC-1.3) Suite', () => {
  
  it('1. Deve forçar fail-closed para histórico insuficiente (< 3 ciclos)', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2024, scores: { composite: 80 } },
      { year: 2025, scores: { composite: 75 } }
    ];

    const profile = InstitutionalCausalityOrchestrator.evaluate(cycles);
    assert.equal(profile.historicalDensityRequirement, 'INSUFFICIENT');
    assert.equal(profile.confidenceProfile.globalConfidence, LOW_CONFIDENCE);
    assert.equal(profile.confidenceProfile.temporalConfidence, 0.0);
    assert.equal(profile.confidenceProfile.evidenceDensityConfidence, 0.0);
    assert.equal(profile.narrative, 'Histórico insuficiente para inferência causal longitudinal.');
    assert.deepEqual(profile.sequences, []);
    assert.deepEqual(profile.propagationVectors, []);
    assert.deepEqual(profile.graph.nodes, []);
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

    const payload = {
      isMockData: false,
      historicalCyclesCount: 3,
      runtimeHistory: cycles,
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
        { code: '1.1.2', accountName: 'Estoque', value: 150 }
      ]
    };

    const report = executiveRuntime.generateExecutiveReport(payload);
    assert.ok(report.institutionalCausality);
    assert.equal(report.institutionalCausality.historicalDensityRequirement, 'SUFFICIENT');
    assert.ok(report.advisory.actionMatrix[0].includes('Preservação e reforço imediato de liquidez estrutural'));
    assert.equal(report.advisory.priorityFocus, 'Liquidez estrutural, capitalização e autonomia fiduciária.');
  });
});
