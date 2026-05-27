import { test, describe, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { MultiTenantIsolationGuard } from '../src/core/runtime/institutional-memory/MultiTenantIsolationGuard';
import { RecommendationPersistenceTracker } from '../src/core/runtime/institutional-memory/RecommendationPersistenceTracker';
import { LongitudinalMaturityEngine } from '../src/core/runtime/institutional-memory/LongitudinalMaturityEngine';
import { InstitutionalLearningEngine } from '../src/core/runtime/institutional-memory/InstitutionalLearningEngine';
import { GovernanceRecurrenceEngine } from '../src/core/runtime/institutional-memory/GovernanceRecurrenceEngine';
import { HistoricalReplayIndex } from '../src/core/runtime/institutional-memory/HistoricalReplayIndex';
import { InstitutionalMemoryRegistry } from '../src/core/runtime/institutional-memory/InstitutionalMemoryRegistry';
import { HistoricalCycleData } from '../src/core/runtime/institutional-memory/types';

describe('Institutional Memory & Longitudinal Intelligence Layer', () => {

  beforeEach(() => {
    InstitutionalMemoryRegistry.clearForTest();
  });

  const baseCycle = (year: number, tenantId: string = 'TENANT-A'): HistoricalCycleData => ({
    year,
    tenantId,
    correlationId: `corr-${year}`,
    lineageHash: `hash-${year}`,
    recommendations: [],
    violations: [],
    decisions: [],
    scores: { composite: 80 }
  });

  test('1. Replay histórico reconstrói advisory corretamente (HistoricalReplayIndex preserva lineage e advisory Hash sem payload gigante)', () => {
    const index = HistoricalReplayIndex.createIndex(
      'TENANT-A', 'corr-123', 'lineage-abc', 'advisory-xyz', 85, ['ANOM-1']
    );
    assert.strictEqual(index.tenantId, 'TENANT-A');
    assert.strictEqual(index.lineageHash, 'lineage-abc');
    assert.strictEqual(index.advisoryHash, 'advisory-xyz');
    assert.strictEqual((index as any).bpData, undefined); // Snapshots não armazenam payload redundante (Req 8)
  });

  test('2. Recommendation persistence exige mínimo de 3 recorrências', () => {
    const cycles = [
      { ...baseCycle(2021), recommendations: ['Reduzir alavancagem'] },
      { ...baseCycle(2022), recommendations: ['Reduzir alavancagem'] }
    ];
    // Apenas 2 ciclos: não deve acusar ignorado
    assert.strictEqual(RecommendationPersistenceTracker.trackIgnored(cycles).length, 0);

    const cycles3 = [
      ...cycles,
      { ...baseCycle(2023), recommendations: ['Reduzir alavancagem'] }
    ];
    // 3 ciclos: deve acusar
    const ignored = RecommendationPersistenceTracker.trackIgnored(cycles3);
    assert.strictEqual(ignored.length, 1);
    assert.ok(ignored[0].includes('3 ciclos consecutivos'));
  });

  test('3. maturityScore evolui temporalmente (sobe com resiliência, cai com violações)', () => {
    const cyclesImproving = [
      { ...baseCycle(2021), scores: { composite: 50 } },
      { ...baseCycle(2022), scores: { composite: 60 } },
      { ...baseCycle(2023), scores: { composite: 75 } }
    ];
    const profileImproving = LongitudinalMaturityEngine.evaluate(cyclesImproving);
    assert.strictEqual(profileImproving.maturityTrend, 'IMPROVING');
    assert.strictEqual(profileImproving.resilienceTrend, 100);

    const cyclesDeteriorating = [
      { ...baseCycle(2021), scores: { composite: 80 } },
      { ...baseCycle(2022), scores: { composite: 60 } },
      { ...baseCycle(2023), scores: { composite: 40 } }
    ];
    const profileDet = LongitudinalMaturityEngine.evaluate(cyclesDeteriorating);
    assert.strictEqual(profileDet.maturityTrend, 'DETERIORATING');
    assert.strictEqual(profileDet.deteriorationTrend, 100);
  });

  test('4. Deterioração progressiva aumenta severity via GovernanceRecurrenceEngine', () => {
    const cycles = [
      { ...baseCycle(2021), scores: { composite: 80 } },
      { ...baseCycle(2022), scores: { composite: 70 } },
      { ...baseCycle(2023), scores: { composite: 60 } }
    ];
    const result = GovernanceRecurrenceEngine.evaluate(cycles);
    assert.ok(result.deteriorationSignals.length > 0);
    // Deve ser HIGH_RECURRENCE pelo declínio composto consecutivo
    assert.strictEqual(result.recurrenceSeverity, 'HIGH_RECURRENCE');
  });

  test('5. Advisory ignorado aumenta governance fatigue', () => {
    const cycles = [
      { ...baseCycle(2021), recommendations: ['Aumentar caixa'] },
      { ...baseCycle(2022), recommendations: ['Aumentar caixa'] },
      { ...baseCycle(2023), recommendations: ['Aumentar caixa'] }
    ];
    const signals = InstitutionalLearningEngine.evaluate(cycles, 3);
    assert.strictEqual(signals.governanceFatigueScore, 20); // 1 recomendação * 20 pontos
    assert.ok(signals.executiveResponsivenessScore < 50); // Deve cair
  });

  test('6. Replay cross-tenant é bloqueado (MultiTenantIsolationGuard)', () => {
    const cycles = [
      { ...baseCycle(2021, 'TENANT-A') },
      { ...baseCycle(2022, 'TENANT-B') } // Violação
    ];
    assert.throws(() => MultiTenantIsolationGuard.validate('TENANT-A', cycles), /CROSS_TENANT_LONGITUDINAL_ATTEMPT/);
  });

  test('7. Anomaly recurrence gera escalation (GovernanceRecurrenceEngine)', () => {
    const violation = { violationId: 'ANOMALY_1', severity: 'HIGH', message: 'Anomalia sistêmica', sourceContext: 'Anomaly' };
    const cycles = [
      { ...baseCycle(2021), violations: [violation] },
      { ...baseCycle(2022), violations: [violation] },
      { ...baseCycle(2023), violations: [violation] }
    ];
    const result = GovernanceRecurrenceEngine.evaluate(cycles);
    assert.strictEqual(result.recurrenceSeverity, 'CRITICAL_STRUCTURAL_RECURRENCE');
    assert.ok(result.structuralPersistence.length > 0);
  });

  test('9. Lineage hashes permanecem consistentes no registry', () => {
    const entry = HistoricalReplayIndex.createIndex('TENANT-A', 'corr-1', 'lin-hash-1', 'adv-hash-1', 90, []);
    InstitutionalMemoryRegistry.appendReplayIndex(entry);
    const retrieved = InstitutionalMemoryRegistry.getReplayIndexes('TENANT-A')[0];
    assert.strictEqual(retrieved.lineageHash, 'lin-hash-1');
  });

  test('10. InstitutionalLearningEngine rejeita inferência sem evidência histórica', () => {
    // Menos que o mínimo (3 ciclos)
    const cycles = [{ ...baseCycle(2021) }, { ...baseCycle(2022) }];
    const signals = InstitutionalLearningEngine.evaluate(cycles, 3);
    assert.strictEqual(signals.governanceFatigueScore, 0); // Fail-closed
    assert.strictEqual(signals.advisoryAdherenceScore, 50);
  });

  test('12. Historical replay funciona sem runtime mutation (Immutability)', () => {
    const entry = HistoricalReplayIndex.createIndex('TENANT-A', 'corr-1', 'lin-hash-1', 'adv-hash-1', 90, []);
    const stored = InstitutionalMemoryRegistry.appendReplayIndex(entry);
    assert.throws(() => {
      (stored as any).maturityScore = 100;
    }); // Objeto deve estar congelado (Object.freeze)
  });

  test('14. Tenant isolation permanece intacto no Registry', () => {
    InstitutionalMemoryRegistry.appendReplayIndex(HistoricalReplayIndex.createIndex('TENANT-A', 'c-1', 'l-1', 'a-1', 90, []));
    InstitutionalMemoryRegistry.appendReplayIndex(HistoricalReplayIndex.createIndex('TENANT-B', 'c-2', 'l-2', 'a-2', 80, []));

    const recordsA = InstitutionalMemoryRegistry.getReplayIndexes('TENANT-A');
    assert.strictEqual(recordsA.length, 1);
    assert.strictEqual(recordsA[0].tenantId, 'TENANT-A');
  });

  test('15. Replay temporal preserva correlationId', () => {
    const entry = HistoricalReplayIndex.createIndex('TENANT-A', 'corr-999', 'lin', 'adv', 50, []);
    assert.strictEqual(entry.correlationId, 'corr-999');
  });
});
