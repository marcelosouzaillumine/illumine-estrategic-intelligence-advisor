import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalMemoryEngine } from '../src/core/runtime/institutional-memory/InstitutionalMemoryEngine';
import { HistoricalDecisionLedger, HistoricalLedgerError } from '../src/core/runtime/institutional-memory/HistoricalDecisionLedger';
import { InstitutionalMemoryRegistry } from '../src/core/runtime/institutional-memory/InstitutionalMemoryRegistry';
import { InstitutionalPatternRecognitionEngine } from '../src/core/runtime/institutional-memory/InstitutionalPatternRecognitionEngine';
import { AdvisoryContinuityEngine } from '../src/core/runtime/institutional-memory/AdvisoryContinuityEngine';
import { GovernanceTimelineEngine } from '../src/core/runtime/institutional-memory/GovernanceTimelineEngine';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { HistoricalCycleData, InstitutionalMemoryRecord } from '../src/core/runtime/institutional-memory/types';

describe('Institutional Memory Engine (RC-1.2A) Suite', () => {
  beforeEach(() => {
    HistoricalDecisionLedger.clear();
    InstitutionalMemoryRegistry.clearForTest();
  });

  // 1. Recorrência de caixa (declining cash / cash flow stress via patterns)
  it('1. Deve detectar recorrência de caixa e estresse de fluxo de caixa', () => {
    const record1: InstitutionalMemoryRecord = {
      memoryId: 'mem-1',
      tenantId: 'TENANT-1',
      entityId: 'ENT-1',
      timestamp: '2026-01-01T00:00:00Z',
      runtimeReferenceId: 'ref-1',
      lineageHash: 'hash-1',
      governanceCategory: 'Caixa',
      severityLevel: 'WARNING',
      executiveUrgency: 'REVIEW',
      narrativeSnapshot: 'Consumo de caixa',
      causalSummary: 'Estresse financeiro',
      recommendationSnapshot: ['Preservar caixa e reduzir novos investimentos.'],
      confidenceSnapshot: 'HIGH',
      memorySource: 'RUNTIME',
      integrityStatus: 'VERIFIED'
    };

    const record2 = { ...record1, memoryId: 'mem-2', timestamp: '2026-02-01T00:00:00Z', lineageHash: 'hash-2' };
    const record3 = { ...record1, memoryId: 'mem-3', timestamp: '2026-03-01T00:00:00Z', lineageHash: 'hash-3' };

    InstitutionalMemoryRegistry.append(record1);
    InstitutionalMemoryRegistry.append(record2);
    InstitutionalMemoryRegistry.append(record3);

    const records = InstitutionalMemoryRegistry.getRecords('TENANT-1');
    const patterns = InstitutionalPatternRecognitionEngine.detectPatterns(records);
    const cashStressPattern = patterns.find(p => p.patternType === 'CASH_FLOW_STRESS');

    assert.ok(cashStressPattern);
    assert.equal(cashStressPattern.recurrence, 'RECURRING');
    assert.equal(cashStressPattern.frequencyCount, 3);
  });

  // 2. Recomendações ignoradas
  it('2. Deve registrar recomendações repetidas (ignoradas) de forma consecutiva', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        recommendations: ['Reduzir OPEX imediato', 'Aportar capital próprio'],
        violations: []
      },
      {
        year: 2024,
        scores: { composite: 75 },
        recommendations: ['Reduzir OPEX imediato', 'Outra recomendação'],
        violations: []
      },
      {
        year: 2025,
        scores: { composite: 70 },
        recommendations: ['Reduzir OPEX imediato', 'Outra recomendação 2'],
        violations: []
      }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.equal(profile.ignoredRecommendations.length, 1);
    assert.ok(profile.ignoredRecommendations[0].includes('Reduzir OPEX imediato'));
    assert.ok(profile.ignoredRecommendations[0].includes('3 ciclos consecutivos'));
  });

  // 3. Deterioração progressiva
  it('3. Deve sinalizar deterioração progressiva de score', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2023, scores: { composite: 85 } },
      { year: 2024, scores: { composite: 75 } },
      { year: 2025, scores: { composite: 65 } }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.ok(profile.deteriorationSignals.some(s => s.includes('declinou consecutivamente')));
    assert.equal(profile.recurrenceSeverity, 'HIGH_RECURRENCE');
  });

  // 4. Recuperação consistente
  it('4. Deve identificar recuperação consistente de notas estruturais', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2023, scores: { composite: 60 } },
      { year: 2024, scores: { composite: 70 } },
      { year: 2025, scores: { composite: 80 } }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.ok(profile.recurrencePatterns.includes('Recuperação consistente dos fundamentos de governança e financeiros.'));
  });

  // 5. Falso positivo de recorrência
  it('5. Não deve disparar alertas persistentes para flutuação pontual', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2023, scores: { composite: 80 } },
      { year: 2024, scores: { composite: 80 } },
      { year: 2025, scores: { composite: 78 } }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.ok(!profile.deteriorationSignals.some(s => s.includes('declinou consecutivamente')));
  });

  // 6. Histórico insuficiente (Fail-Closed)
  it('6. Deve forçar fail-closed para histórico insuficiente (< 3 ciclos)', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2024, scores: { composite: 80 } },
      { year: 2025, scores: { composite: 70 } }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.equal(profile.historicalDensityRequirement, 'INSUFFICIENT');
    assert.equal(profile.recurrenceConfidence, 'LOW');
    assert.deepEqual(profile.recurrencePatterns, []);
    assert.deepEqual(profile.ignoredRecommendations, []);
    assert.deepEqual(profile.deteriorationSignals, ['Histórico insuficiente para inferência evolutiva.']);

    // Integrado com o Executive Runtime
    const payload = {
      isMockData: false,
      historicalCyclesCount: 2,
      runtimeHistory: cycles,
      rawFinancialData: {
        segmentoEmpresa: 'SaaS',
        bpSummary: {
          ativoTotal: 1000,
          ativoCirculante: 500,
          passivoCirculante: 400,
          passivoTotal: 600,
          patrimonioLiquido: 400,
          caixaEquivalentes: 100,
          estoques: 0
        }
      },
      bpData: [{ accountId: '1', value: 1000 }, { accountId: '3', value: 400 }]
    };

    const report = executiveRuntime.generateExecutiveReport(payload);
    assert.ok(report.advisory.executiveSummary.includes('Histórico insuficiente para inferência evolutiva.'));
  });

  // 7. Mudança de padrão operacional
  it('7. Deve rastrear mudança de padrão operacional ou archetype', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        bpData: [
          { code: '1.1.1', accountName: 'Estoque', value: 10 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2024,
        scores: { composite: 80 },
        bpData: [
          { code: '1.1.1', accountName: 'Estoque', value: 20 },
          { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
        ]
      },
      {
        year: 2025,
        scores: { composite: 75 },
        bpData: [
          { code: '1.1.1', accountName: 'Estoque', value: 80 }, // Estoque cresceu de 10 para 80 (>15%)
          { code: '3', accountName: 'Patrimônio Líquido', value: 102 } // PL estável (<5% crescimento)
        ]
      }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.ok(profile.decisionPatterns.includes('Crescimento operacional sem reforço proporcional de capital próprio.'));
  });

  // 8. Reincidência de violations
  it('8. Deve monitorar a reincidência de violações específicas', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      },
      {
        year: 2024,
        scores: { composite: 75 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      },
      {
        year: 2025,
        scores: { composite: 70 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    assert.equal(profile.recurrenceSeverity, 'CRITICAL_STRUCTURAL_RECURRENCE');
    assert.ok(profile.structuralPersistence.some(p => p.includes('V-01') && p.includes('persiste por 3 ciclos')));
  });

  // 9. Inconsistência temporal
  it('9. Deve lidar corretamente com anos fora de ordem via ordenação temporal', () => {
    const cycles: HistoricalCycleData[] = [
      { year: 2025, scores: { composite: 60 } },
      { year: 2023, scores: { composite: 80 } },
      { year: 2024, scores: { composite: 70 } }
    ];

    const profile = InstitutionalMemoryEngine.buildMemory(cycles);
    // Deve ordenar: 2023 -> 2024 -> 2025, detectando deterioração progressiva
    assert.ok(profile.deteriorationSignals.some(s => s.includes('declinou consecutivamente')));
  });

  // 10. Tentativa de mutação do ledger
  it('10. Deve proibir atualizações e deleções no ledger fiduciário (append-only)', () => {
    const entry = {
      decisionId: 'dec-1',
      timestamp: '2026-05-27T00:00:00Z',
      decisionType: 'APPROVAL',
      approvalState: 'APPROVED',
      lineageHash: 'hash-abc'
    };

    HistoricalDecisionLedger.append(entry);
    assert.equal(HistoricalDecisionLedger.getAll().length, 1);

    // Tentativas de mutação direta
    assert.throws(() => {
      HistoricalDecisionLedger.update();
    }, (err: any) => err instanceof HistoricalLedgerError && err.message.includes('MUTATION_PROHIBITED'));

    assert.throws(() => {
      HistoricalDecisionLedger.delete();
    }, (err: any) => err instanceof HistoricalLedgerError && err.message.includes('MUTATION_PROHIBITED'));
  });

  // 11. Timeline sem lineage
  it('11. Deve rejeitar registros na memória fiduciária se lineageHash ou metadados estiverem ausentes', () => {
    const invalidRecord = {
      tenantId: 'TENANT-1',
      entityId: 'ENT-1',
      timestamp: '2026-01-01T00:00:00Z',
      runtimeReferenceId: 'ref-1',
      lineageHash: '', // Sem lineage
      governanceCategory: 'Liquidez',
      severityLevel: 'WARNING',
      executiveUrgency: 'REVIEW',
      narrativeSnapshot: 'Sem lineage',
      causalSummary: 'Teste',
      recommendationSnapshot: [],
      confidenceSnapshot: 'HIGH',
      memorySource: 'RUNTIME' as const,
      integrityStatus: 'VERIFIED' as const
    };

    assert.throws(() => {
      InstitutionalMemoryRegistry.append(invalidRecord);
    }, (err: any) => err instanceof Error && err.message.includes('VIOLAÇÃO DE MEMÓRIA'));
  });

  // 12. Confidence inconsistente
  it('12. Deve rebaixar a confiança estratégica em cenários de recorrência crítica', () => {
    const cycles: HistoricalCycleData[] = [
      {
        year: 2023,
        scores: { composite: 80 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      },
      {
        year: 2024,
        scores: { composite: 75 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      },
      {
        year: 2025,
        scores: { composite: 60 },
        violations: [{ violationId: 'V-01', severity: 'CRITICAL', message: 'Liquidez Baixa', sourceContext: 'Liquidez' }]
      }
    ];

    const payload = {
      isMockData: false,
      historicalCyclesCount: 3,
      runtimeHistory: cycles,
      rawFinancialData: {
        segmentoEmpresa: 'SaaS',
        bpSummary: {
          ativoTotal: 1000,
          ativoCirculante: 500,
          passivoCirculante: 400,
          passivoTotal: 600,
          patrimonioLiquido: 400,
          caixaEquivalentes: 100,
          estoques: 0
        }
      },
      bpData: [{ accountId: '1', value: 1000 }, { accountId: '3', value: 400 }]
    };

    const report = executiveRuntime.generateExecutiveReport(payload);
    // Como recurrenceSeverity é CRITICAL_STRUCTURAL_RECURRENCE, a recurrenceConfidence deve ser LOW
    assert.equal(report.institutionalMemory?.recurrenceConfidence, 'LOW');
    // Deve aplicar a penalidade de -15 pontos estruturais e compostos no report
    assert.ok(report.scores.structural < 60); // Base seria maior sem a penalidade
  });
});
