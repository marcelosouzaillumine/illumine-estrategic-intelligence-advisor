import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { FirestoreGraphRepository } from '../src/core/knowledge-graph/storage/FirestoreGraphRepository';
import { GraphTenantGuard } from '../src/core/knowledge-graph/storage/GraphTenantGuard';
import { PersistentGraphNode } from '../src/types/knowledge-graph/PersistentGraphNode';
import { InstitutionalGraphRegistry } from '../src/core/knowledge-graph/InstitutionalGraphRegistry';
import { GraphSnapshotEngine } from '../src/core/knowledge-graph/snapshots/GraphSnapshotEngine';

describe('Graph Persistence Layer v2.0 Tests', () => {
  const tenantA = 'tenant-A';
  const tenantB = 'tenant-B';
  const correlationId = 'corr-123';

  let repo: FirestoreGraphRepository;
  let guardedRepo: GraphTenantGuard;

  beforeEach(() => {
    repo = new FirestoreGraphRepository();
    guardedRepo = new GraphTenantGuard(repo, tenantA);
    InstitutionalGraphRegistry.clear();
    InstitutionalGraphRegistry.setRepository(repo, tenantA, correlationId);
  });

  test('GraphRepository & FirestoreGraphRepository: should save and retrieve a node', async () => {
    const node: PersistentGraphNode = {
      nodeId: 'node-1',
      nodeType: 'DECISION',
      title: 'Approve Strategy',
      description: 'Test node',
      confidenceLevel: 'HIGH',
      tenantId: tenantA,
      correlationId,
      lineageId: 'lin-1',
      sourceEngine: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await repo.saveNode(node);
    const retrieved = await repo.getNode(tenantA, 'node-1');
    assert.ok(retrieved !== undefined);
    assert.strictEqual(retrieved?.title, 'Approve Strategy');
  });

  test('GraphTenantGuard: should block cross-tenant access', async () => {
    const node: PersistentGraphNode = {
      nodeId: 'node-2',
      nodeType: 'RISK',
      title: 'Market Risk',
      description: 'Test risk',
      confidenceLevel: 'HIGH',
      tenantId: tenantB,
      correlationId,
      lineageId: 'lin-2',
      sourceEngine: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await guardedRepo.saveNode(node);
      assert.fail('Should have thrown TENANT_BOUNDARY_VIOLATION');
    } catch (e: any) {
      assert.ok(e.message.includes('TENANT_BOUNDARY_VIOLATION'));
    }
  });

  test('GraphSnapshotEngine: should create a snapshot and persist it', async () => {
    InstitutionalGraphRegistry.registerNode({
      nodeId: 'node-3',
      nodeType: 'EVIDENCE',
      title: 'Financial Report',
      description: 'Test evidence',
      confidenceLevel: 'HIGH',
      createdAt: new Date().toISOString()
    });

    const snapshot = await GraphSnapshotEngine.createSnapshot('snap-1', tenantA, correlationId, 'lin-snap-1');
    assert.ok(snapshot !== null);
    assert.strictEqual(snapshot?.nodes.length, 1);

    const loadedSnapshot = await repo.loadSnapshot(tenantA, 'snap-1');
    assert.ok(loadedSnapshot !== undefined);
    assert.strictEqual(loadedSnapshot?.snapshotId, 'snap-1');
  });
});
