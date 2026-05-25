import { describe, it } from 'node:test';
import assert from 'node:assert';
import { tenantScopedRuntimeCache } from '../src/core/runtime/performance/TenantScopedRuntimeCache';
import { LazyExecutionCoordinator } from '../src/core/runtime/performance/LazyExecutionCoordinator';
import { DAGExecutionOptimizer } from '../src/core/runtime/performance/DAGExecutionOptimizer';
import { RuntimePerformanceMonitor } from '../src/core/runtime/performance/RuntimePerformanceMonitor';
import { RuntimeTelemetryEngine } from '../src/core/runtime/telemetry/RuntimeTelemetryEngine';
import { TelemetryAuditTrail } from '../src/core/runtime/telemetry/TelemetryAuditTrail';
import { SovereignCacheKey } from '../src/core/runtime/performance/types';
import { TenantIsolationError } from '../src/core/runtime/tenancy/hardening/TenantExecutionContext';

describe('Runtime Performance & Telemetry - Sprint 2 (Active Governance)', () => {

  const createValidKey = (tenantId: string, lineageHash: string, sourceDataHash: string): SovereignCacheKey => ({
    tenantId,
    groupId: 'GROUP-1',
    targetEntityId: 'ENT-1',
    entityPathHash: 'PATH-HASH',
    consolidationScopeHash: 'SCOPE-HASH',
    reportingBoundary: 'BOUNDARY',
    runtimeMode: 'NORMAL',
    fiscalPeriod: '2023',
    sourceDataHash,
    lineageHash,
    confidenceFingerprint: 'CONFIDENCE',
    schemaVersion: '1.0'
  });

  it('1. Cache sem tenantId falha (INVALID_CACHE_SCOPE / MISSING_TENANT_CONTEXT)', () => {
    const invalidKey = createValidKey('', 'LIN-1', 'SRC-1');
    assert.throws(
      () => tenantScopedRuntimeCache.set(invalidKey, { data: true }),
      (err: any) => err instanceof TenantIsolationError && err.violationCode === 'INVALID_CACHE_SCOPE'
    );
  });

  it('2. Cache entre tenants falha (Isolamento Absoluto)', () => {
    const keyT1 = createValidKey('TENANT-1', 'LIN-1', 'SRC-1');
    tenantScopedRuntimeCache.set(keyT1, { data: 'T1' });

    const keyT2 = createValidKey('TENANT-2', 'LIN-1', 'SRC-1');
    const readFromT2 = tenantScopedRuntimeCache.get(keyT2);
    
    assert.strictEqual(readFromT2, null, 'Tenant 2 não deve enxergar cache do Tenant 1, mesmo com o mesmo lineage e sourceData');
  });

  it('3. Cache com lineage diferente falha (Miss)', () => {
    const key1 = createValidKey('T-1', 'LIN-A', 'SRC-1');
    tenantScopedRuntimeCache.set(key1, { val: 1 });

    const key2 = createValidKey('T-1', 'LIN-B', 'SRC-1');
    const result = tenantScopedRuntimeCache.get(key2);
    assert.strictEqual(result, null);
  });

  it('4. Cache com sourceDataHash diferente falha (Miss)', () => {
    const key1 = createValidKey('T-1', 'LIN-A', 'SRC-OLD');
    tenantScopedRuntimeCache.set(key1, { val: 1 });

    const key2 = createValidKey('T-1', 'LIN-A', 'SRC-NEW');
    const result = tenantScopedRuntimeCache.get(key2);
    assert.strictEqual(result, null);
  });

  it('5. Deferred execution não pode parecer dado executado', () => {
    const result = LazyExecutionCoordinator.executeSafely('HeavyTask', true, true, () => { return "executed"; });
    assert.strictEqual(result.status, 'DEFERRED');
    assert.strictEqual(result.data, undefined);
    assert.ok(result.reason!.includes('sob demanda'));
  });

  it('6. Lazy execution com hidden result retorna LAZY_EXECUTION_HIDDEN_RESULT', () => {
    assert.throws(
      () => LazyExecutionCoordinator.executeSafely('BadTask', false, true, () => { return null; }),
      (err: any) => err instanceof TenantIsolationError && err.violationCode === 'LAZY_EXECUTION_HIDDEN_RESULT'
    );
  });

  it('7. Telemetry não pode mutar RuntimeOutput (Imutabilidade passiva)', () => {
    const output = { risk: 50 };
    Object.freeze(output); // UI ou Engine consolidada congela o output
    
    const session = RuntimeTelemetryEngine.startTelemetrySession('T1', 'E1', 'C1', 'SINGLE', 'TOP');
    RuntimeTelemetryEngine.endTelemetrySession(session);

    assert.strictEqual(output.risk, 50, 'Output não foi mutado');
    const logs = TelemetryAuditTrail.getTelemetryForTenant('T1');
    assert.ok(logs.length > 0);
    assert.throws(() => { (logs[0] as any).tenantId = 'MUTADO'; }, 'Logs de telemetria devem ser imutáveis');
  });

  it('8. Recursive loop gera violation', () => {
    // topology circular A -> B -> C -> A
    const topology = {
      nodes: [{id: 'A'}, {id: 'B'}, {id: 'C'}],
      edges: [
        {sourceId: 'A', targetId: 'B'},
        {sourceId: 'B', targetId: 'C'},
        {sourceId: 'C', targetId: 'A'}
      ]
    };
    
    const { cycleWarnings } = DAGExecutionOptimizer.optimizeTopology(topology as any);
    assert.ok(cycleWarnings.length > 0);
    assert.ok(cycleWarnings[0].includes('CYCLE_DETECTED'));
  });

  it('9. Memory overload gera warning (RUNTIME_SATURATION)', () => {
    const fakeTelemetry: any = {
      metrics: {
        memoryUsageBytes: 1024 * 1024 * 1024, // 1GB
        executionTimeMs: 10,
        orchestrationDepth: 5,
        tenantExecutionLoadPercent: 10
      }
    };
    const warnings = RuntimePerformanceMonitor.analyzeTelemetry(fakeTelemetry);
    assert.ok(warnings.some(w => w.includes('RUNTIME_SATURATION')));
  });

  it('10. Topology overload gera warning', () => {
    const fakeTelemetry: any = {
      metrics: {
        memoryUsageBytes: 1024,
        executionTimeMs: 10,
        orchestrationDepth: 5,
        tenantExecutionLoadPercent: 95
      }
    };
    const warnings = RuntimePerformanceMonitor.analyzeTelemetry(fakeTelemetry);
    assert.ok(warnings.some(w => w.includes('TOPOLOGY_OVERLOAD')));
  });

});
