import test from 'node:test';
import assert from 'node:assert';
import { 
  TenantGovernanceEnforcer, 
  TenantExecutionContext, 
  TenantViolations,
  LegacyTenantContextAdapter
} from '../src/core/runtime/tenancy/hardening';

test('Tenant Isolation Hardening (RC-1.1A)', async (t) => {

  await t.test('1. Deve falhar com MISSING_TENANT_CONTEXT se tentar executar sem tenant', () => {
    assert.throws(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        undefined, 
        [], 
        { groupId: 'group-1', nodes: [], edges: [], intercompanyOperations: [] }
      );
    }, (err: any) => err.violationCode === TenantViolations.MISSING_TENANT_CONTEXT);
  });

  await t.test('2. Deve bloquear CROSS_TENANT_ACCESS quando entidade for de outro tenant', () => {
    const context: TenantExecutionContext = {
      tenantId: 'tenant-a',
      executionScope: 'CONSOLIDATION',
      entityScope: ['entity-1'],
      runtimeScope: 'MULTI_ENTITY',
      auditScope: 'admin'
    };

    const entities: any[] = [
      { id: 'entity-1', tenantId: 'tenant-b', name: 'Infiltrada', role: 'SUBSIDIARY', ownershipPercentage: 100 }
    ];

    assert.throws(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        context,
        entities,
        { groupId: 'group-1', nodes: [], edges: [], intercompanyOperations: [] }
      );
    }, (err: any) => err.violationCode === TenantViolations.CROSS_TENANT_ACCESS);
  });

  await t.test('3. Deve bloquear INVALID_ENTITY_SCOPE quando tentar acessar entidade fora do entityScope', () => {
    const context: TenantExecutionContext = {
      tenantId: 'tenant-a',
      executionScope: 'CONSOLIDATION',
      entityScope: ['entity-1'], // Only entity-1 allowed
      runtimeScope: 'MULTI_ENTITY',
      auditScope: 'admin'
    };

    const entities: any[] = [
      { id: 'entity-1', tenantId: 'tenant-a', name: 'OK', role: 'PARENT', ownershipPercentage: 100 },
      { id: 'entity-2', tenantId: 'tenant-a', name: 'Fora do Escopo', role: 'SUBSIDIARY', ownershipPercentage: 100 }
    ];

    assert.throws(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        context,
        entities,
        { groupId: 'group-1', nodes: [], edges: [], intercompanyOperations: [] }
      );
    }, (err: any) => err.violationCode === TenantViolations.INVALID_ENTITY_SCOPE);
  });

  await t.test('4. Deve bloquear INVALID_TOPOLOGY_SCOPE se alguma entidade for órfã (sem tenantId)', () => {
    const context: TenantExecutionContext = {
      tenantId: 'tenant-a',
      executionScope: 'CONSOLIDATION',
      entityScope: ['entity-1'],
      runtimeScope: 'MULTI_ENTITY',
      auditScope: 'admin'
    };

    const entities: any[] = [
      { id: 'entity-1', name: 'Orfã', role: 'PARENT', ownershipPercentage: 100 }
    ];

    assert.throws(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        context,
        entities,
        { groupId: 'group-1', nodes: [], edges: [], intercompanyOperations: [] }
      );
    }, (err: any) => err.violationCode === TenantViolations.INVALID_TOPOLOGY_SCOPE);
  });

  await t.test('5. Deve permitir execução quando topologia e entidades são aderentes (Sovereignty OK)', () => {
    const context: TenantExecutionContext = {
      tenantId: 'tenant-a',
      executionScope: 'CONSOLIDATION',
      entityScope: ['entity-1', 'entity-2'],
      runtimeScope: 'MULTI_ENTITY',
      auditScope: 'admin'
    };

    const entities: any[] = [
      { id: 'entity-1', tenantId: 'tenant-a', name: 'Matriz', role: 'PARENT', ownershipPercentage: 100 },
      { id: 'entity-2', tenantId: 'tenant-a', name: 'Filial', role: 'SUBSIDIARY', ownershipPercentage: 100 }
    ];

    const topology: any = {
      nodes: [{ id: 'entity-1' }, { id: 'entity-2' }],
      edges: [{ sourceId: 'entity-1', targetId: 'entity-2' }]
    };

    assert.doesNotThrow(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        context,
        entities,
        topology
      );
    });
  });

  await t.test('6. O Cache Access Checker deve barrar cache estrangeiro (TENANT_BOUNDARY_VIOLATION)', () => {
    const context: TenantExecutionContext = {
      tenantId: 'tenant-a',
      executionScope: 'CONSOLIDATION',
      entityScope: ['entity-1'],
      runtimeScope: 'MULTI_ENTITY',
      auditScope: 'admin'
    };

    assert.throws(() => {
      TenantGovernanceEnforcer.enforceCacheAccess(context, 'entity-1', 'tenant-b');
    }, (err: any) => err.violationCode === TenantViolations.TENANT_BOUNDARY_VIOLATION);
  });

  await t.test('7. O Legacy Adapter deve prover contexto de backward compatibility de forma auditável', () => {
    const ctx = LegacyTenantContextAdapter.createLegacyContext('entity-legacy', 'system-admin');
    
    assert.strictEqual(ctx.tenantId, 'LEGACY_SINGLE_TENANT_ID');
    assert.strictEqual(ctx.entityScope[0], 'entity-legacy');
    assert.strictEqual(LegacyTenantContextAdapter.isLegacyContext(ctx), true);

    // Deve passar no validador
    assert.doesNotThrow(() => {
      TenantGovernanceEnforcer.enforceConsolidationBoundaries(
        ctx,
        [],
        { groupId: 'group-1', nodes: [], edges: [], intercompanyOperations: [] }
      );
    });
  });

});
