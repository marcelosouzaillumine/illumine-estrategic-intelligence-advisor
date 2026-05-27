import { test, describe, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { HistoricalReplayIndex } from '../src/core/runtime/institutional-memory/HistoricalReplayIndex';
import { MemoryRetentionGovernance } from '../src/core/runtime/institutional-memory/MemoryRetentionGovernance';
import { ReplayMetadataRegistry, DataAccessContext } from '../src/core/runtime/institutional-memory/ReplayMetadataRegistry';
import { LongitudinalSnapshotSummary } from '../src/core/runtime/institutional-memory/LongitudinalSnapshotSummary';
import { InstitutionalMemoryRegistry } from '../src/core/runtime/institutional-memory/InstitutionalMemoryRegistry';

describe('Phase 2: Historical Replay Index & Retention Governance', () => {

  beforeEach(() => {
    InstitutionalMemoryRegistry.clearForTest();
  });

  const getBaseEntry = (id: string, timestamp: string) => ({
    replayId: id,
    tenantId: 'TENANT-X',
    entityScope: 'ENT-1',
    lineageHash: `lin-${id}`,
    inputHash: `in-${id}`,
    advisoryHash: `adv-${id}`,
    correlationId: `corr-${id}`,
    timestamp,
    period: '2023Q1',
    maturityScore: 80,
    governanceConsistencyIndex: 90,
    resilienceTrend: 'STABLE',
    deteriorationTrend: 'STABLE',
    anomalyReferences: ['ANOM-1'],
    recommendationReferences: ['REC-1'],
    retentionLayer: 'HOT' as 'HOT',
    visibilityPolicy: 'RESTRICTED'
  });

  const ctx: DataAccessContext = { tenantId: 'TENANT-X', entityScope: ['ENT-1', 'ENT-2'] };

  test('1. HistoricalReplayIndex registra metadata sem payload completo', () => {
    const entry = getBaseEntry('r1', new Date().toISOString());
    HistoricalReplayIndex.registerReplayIndex(entry);
    const retrieved = HistoricalReplayIndex.buildReplayReference('r1');
    assert.strictEqual(retrieved?.replayId, 'r1');
  });

  test('2. Replay sem lineageHash é negado', () => {
    const entry = { ...getBaseEntry('r2', new Date().toISOString()), lineageHash: '' };
    assert.throws(() => HistoricalReplayIndex.registerReplayIndex(entry), /MISSING_LINEAGE_HASH/);
  });

  test('3. Replay sem correlationId é negado', () => {
    const entry = { ...getBaseEntry('r3', new Date().toISOString()), correlationId: '' };
    assert.throws(() => HistoricalReplayIndex.registerReplayIndex(entry), /MISSING_CORRELATION_ID/);
  });

  test('4. Replay sem tenantId é negado', () => {
    const entry = { ...getBaseEntry('r4', new Date().toISOString()), tenantId: '' };
    assert.throws(() => HistoricalReplayIndex.registerReplayIndex(entry), /MISSING_TENANT_ID/);
  });

  test('5. Replay cross-tenant é bloqueado', () => {
    const entry = getBaseEntry('r5', new Date().toISOString());
    const badCtx = { tenantId: 'HACKER-TENANT' };
    assert.throws(() => ReplayMetadataRegistry.registerReplayMetadata(badCtx, entry), /CROSS_TENANT_BLOCKED/);
  });

  test('6. listReplayMetadataByTenant respeita tenantId', () => {
    ReplayMetadataRegistry.registerReplayMetadata(ctx, getBaseEntry('r6', new Date().toISOString()));
    const badCtx = { tenantId: 'HACKER-TENANT' };
    const list = ReplayMetadataRegistry.listReplayMetadataByTenant(badCtx);
    assert.strictEqual(list.length, 0);
    const validList = ReplayMetadataRegistry.listReplayMetadataByTenant(ctx);
    assert.strictEqual(validList.length, 1);
  });

  test('7. entityScope restringe replay por entidade', () => {
    const entry = { ...getBaseEntry('r7', new Date().toISOString()), entityScope: 'ENT-3' }; // Not in ctx scope
    assert.throws(() => ReplayMetadataRegistry.registerReplayMetadata(ctx, entry), /OUT_OF_SCOPE/);
  });

  test('8. HOT layer aplicada até 90 dias', () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const layer = MemoryRetentionGovernance.classifyRetentionLayer(date.toISOString());
    assert.strictEqual(layer, 'HOT');
  });

  test('9. WARM layer aplicada acima de 90 dias até 2 anos', () => {
    const date = new Date();
    date.setDate(date.getDate() - 150); // 5 months
    const layer = MemoryRetentionGovernance.classifyRetentionLayer(date.toISOString());
    assert.strictEqual(layer, 'WARM');
  });

  test('10. COLD layer aplicada acima de 2 anos', () => {
    const date = new Date();
    date.setDate(date.getDate() - 800); // > 2 years
    const layer = MemoryRetentionGovernance.classifyRetentionLayer(date.toISOString());
    assert.strictEqual(layer, 'COLD');
  });

  test('11. compactWarmMemory remove campos não essenciais', () => {
    const entry = getBaseEntry('r11', new Date().toISOString());
    const warm = MemoryRetentionGovernance.compactWarmMemory(entry);
    assert.strictEqual(warm.retentionLayer, 'WARM');
    assert.strictEqual(warm.anomalyReferences.length, 0);
    assert.strictEqual(warm.recommendationReferences.length, 0);
    assert.strictEqual(warm.maturityScore, 80); // Preserved
  });

  test('12. compactColdMemory preserva hashes e references', () => {
    const entry = getBaseEntry('r12', new Date().toISOString());
    const cold = MemoryRetentionGovernance.compactColdMemory(entry);
    assert.strictEqual(cold.retentionLayer, 'COLD');
    assert.strictEqual(cold.lineageHash, entry.lineageHash);
    assert.strictEqual(cold.inputHash, entry.inputHash);
    assert.strictEqual(cold.maturityScore, 0); // Purged
  });

  test('13. LongitudinalSnapshotSummary rejeita BP/DRE/CashFlow completos', () => {
    assert.throws(() => {
      LongitudinalSnapshotSummary.build({
        maturityScore: 90,
        balanceSheet: { ativoTotal: 1000 } // Forbidden
      });
    }, /must not contain full financial payloads/);
  });

  test('14. retention migration preserva lineageHash/inputHash/correlationId', () => {
    const entry = getBaseEntry('r14', new Date().toISOString());
    const migrated = MemoryRetentionGovernance.migrateRetentionLayer(entry, 'COLD');
    assert.strictEqual(migrated.lineageHash, entry.lineageHash);
    assert.strictEqual(migrated.inputHash, entry.inputHash);
    assert.strictEqual(migrated.correlationId, entry.correlationId);
  });

  test('15. findReplayByLineageHash exige permissão válida', () => {
    const entry = getBaseEntry('r15', new Date().toISOString());
    ReplayMetadataRegistry.registerReplayMetadata(ctx, entry);
    
    const badCtx = { tenantId: 'HACKER' };
    // The method internally calls enforceContextAndIsolation on found entry
    assert.throws(() => ReplayMetadataRegistry.findReplayByLineageHash(badCtx, entry.lineageHash), /CROSS_TENANT_BLOCKED/);
    
    const found = ReplayMetadataRegistry.findReplayByLineageHash(ctx, entry.lineageHash);
    assert.strictEqual(found?.replayId, 'r15');
  });

  test('16. replay metadata respeita visibilityPolicy', () => {
    const entry = { ...getBaseEntry('r16', new Date().toISOString()), visibilityPolicy: '' };
    assert.throws(() => ReplayMetadataRegistry.registerReplayMetadata(ctx, entry), /MISSING_VISIBILITY_POLICY/);
  });

  test('17. InstitutionalMemoryRegistry não persiste runtimePayload completo', () => {
    const entry: any = { ...getBaseEntry('r17', new Date().toISOString()), runtimePayload: { test: 1 } };
    // Because HistoricalReplayIndex.registerReplayIndex called internally enforces it
    assert.throws(() => InstitutionalMemoryRegistry.appendReplayIndex(ctx, entry), /PAYLOAD_BLOAT_DETECTED/);
  });

  test('18. replay histórico permanece reconstruível por lineage', () => {
    const entry = getBaseEntry('r18', new Date().toISOString());
    ReplayMetadataRegistry.registerReplayMetadata(ctx, entry);
    // Cold migration
    const coldEntry = MemoryRetentionGovernance.migrateRetentionLayer(entry, 'COLD');
    
    // Lineage hash is intact
    assert.strictEqual(coldEntry.lineageHash, entry.lineageHash);
    // Replay Metadata could theoretically fetch the cold entry and use lineageHash to hit immutable logs elsewhere.
  });
});
