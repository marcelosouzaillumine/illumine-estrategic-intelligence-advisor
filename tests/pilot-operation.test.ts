import { test } from 'node:test';
import * as assert from 'node:assert';
import { ImportedDataset } from '../src/capabilities/runtime/integrations/IntegrationGovernanceTypes';
import { ImportReviewQueue } from '../src/capabilities/runtime/integrations/ImportReviewQueue';
import { StagingValidationEngine } from '../src/capabilities/runtime/integrations/StagingValidationEngine';
import { ImportPublicationEngine } from '../src/capabilities/runtime/integrations/ImportPublicationEngine';
import { PilotRollbackProtocol } from '../src/capabilities/runtime/integrations/PilotRollbackProtocol';
import { ConnectorAuditLogger } from '../src/capabilities/runtime/integrations/ConnectorAuditLogger';

const createBaseDataset = (importId: string, tenantId: string): ImportedDataset => ({
  importId,
  connectorId: 'MOCK_CONNECTOR',
  tenantId,
  workspaceId: 'WS-1',
  rawPayloadSize: 2000,
  extractedRecords: 20,
  trustLevel: 'HIGH',
  status: 'PENDING_REVIEW',
  lineage: {
    tenantId,
    workspaceId: 'WS-1',
    connectorId: 'MOCK_CONNECTOR',
    importId,
    datasetHash: `hash-${importId}`,
    sourceHash: `source-${importId}`,
    mappingVersion: '1.0',
    timestamp: new Date().toISOString()
  },
  violations: [],
  submittedBy: 'auditor-test',
  submittedAt: new Date().toISOString(),
  policyVersion: 'v1.0.0',
  parsedData: {
    bp: { ativo: 2000, passivo: 1200, pl: 800 },
    dre: { grossRevenue: 1000, deductions: -200, netRevenue: 800, costs: -400 },
    dfc: { initialCash: 200, operatingFlow: 100, investingFlow: -50, financingFlow: 0, finalCash: 250 },
    accountList: [
      { id: '1', name: 'Ativo' },
      { id: '1.1', name: 'Caixa', parentId: '1' }
    ]
  }
});

test('Pilot Rollback Protocol - Soft Rollback de Dataset', async () => {
  const tenantId = 'TENANT-PILOT-1';
  ImportReviewQueue.clearMockDataForTenant(tenantId);
  ImportPublicationEngine.clearMockDataForTenant(tenantId);
  PilotRollbackProtocol.clearMockDataForTenant(tenantId);

  const dataset = createBaseDataset('DS-101', tenantId);
  ImportReviewQueue.enqueue(dataset);

  // Validate and promote
  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, true);
  
  // Set to approved
  dataset.status = 'APPROVED';
  StagingValidationEngine.promoteToRuntime(dataset, 'operator-1');
  assert.strictEqual(dataset.promotedToRuntime, true);

  // Rollback Dataset level fiduciarily (Soft Rollback)
  const justification = 'Inconformidade de saldo identificada na auditoria de balanço.';
  const rollbackEntry = await PilotRollbackProtocol.rollbackDataset(
    'DS-101',
    tenantId,
    'operator-1',
    justification
  );

  // Assertions
  assert.strictEqual(rollbackEntry.scope, 'DATASET');
  assert.strictEqual(rollbackEntry.previousStatus, 'APPROVED');
  assert.strictEqual(rollbackEntry.justification, justification);
  assert.strictEqual(rollbackEntry.actorId, 'operator-1');

  // Verify dataset status is REVERTED and unpromoted
  const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
  const updatedDataset = queue.find(d => d.importId === 'DS-101');
  assert.ok(updatedDataset);
  assert.strictEqual(updatedDataset.status, 'REVERTED');
  assert.strictEqual(updatedDataset.promotedToRuntime, false);
  assert.strictEqual(updatedDataset.stagingValidationPassed, false); // Blocked

  // Ensure history / lineage is kept intact
  assert.ok(updatedDataset.lineage);
  assert.strictEqual(updatedDataset.lineage.importId, 'DS-101');

  // Verify audit logger contains the rollback event
  const logs = ConnectorAuditLogger.getLogsForTenant(tenantId);
  const reversionLog = logs.find(l => l.event === 'IMPORT_REVERTED');
  assert.ok(reversionLog);
  assert.strictEqual(reversionLog.importId, 'DS-101');
});

test('Pilot Rollback Protocol - Soft Rollback de Promoção', async () => {
  const tenantId = 'TENANT-PILOT-2';
  ImportReviewQueue.clearMockDataForTenant(tenantId);
  ImportPublicationEngine.clearMockDataForTenant(tenantId);
  PilotRollbackProtocol.clearMockDataForTenant(tenantId);

  const dataset = createBaseDataset('DS-202', tenantId);
  ImportReviewQueue.enqueue(dataset);

  StagingValidationEngine.validateDataset(dataset);
  dataset.status = 'APPROVED';
  StagingValidationEngine.promoteToRuntime(dataset, 'operator-1');
  
  // Publish dataset
  const publication = ImportPublicationEngine.publish(dataset, 'operator-1');
  assert.ok(publication);
  dataset.status = 'PUBLISHED';

  // Rollback Promotion level fiduciarily (Soft Rollback)
  const justification = 'Despromover publicação devido a ajuste de premissa temporária.';
  const rollbackEntry = await PilotRollbackProtocol.rollbackPromotion(
    'DS-202',
    tenantId,
    'operator-1',
    justification
  );

  assert.strictEqual(rollbackEntry.scope, 'PROMOTION');
  assert.strictEqual(rollbackEntry.previousStatus, 'PUBLISHED');

  // Verify status returns to PENDING_REVIEW
  const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
  const updatedDataset = queue.find(d => d.importId === 'DS-202');
  assert.ok(updatedDataset);
  assert.strictEqual(updatedDataset.status, 'PENDING_REVIEW');
  assert.strictEqual(updatedDataset.promotedToRuntime, false);
  assert.strictEqual(updatedDataset.stagingValidationPassed, true); // Staging validation itself is preserved

  // Verify publication is marked reverted in engine
  const pubs = ImportPublicationEngine.getAllPublications().filter(p => p.importId === 'DS-202');
  assert.strictEqual(pubs.length, 1);
  assert.strictEqual(pubs[0].reverted, true);
  assert.strictEqual(pubs[0].revertedBy, 'operator-1');
  assert.strictEqual(pubs[0].reversionJustification, justification);
});

test('Pilot Rollback Protocol - Soft Rollback de Snapshot do Tenant', async () => {
  const tenantId = 'TENANT-PILOT-3';
  ImportReviewQueue.clearMockDataForTenant(tenantId);
  ImportPublicationEngine.clearMockDataForTenant(tenantId);
  PilotRollbackProtocol.clearMockDataForTenant(tenantId);

  // Enqueue multiple datasets
  const ds1 = createBaseDataset('DS-301', tenantId);
  const ds2 = createBaseDataset('DS-302', tenantId);
  ImportReviewQueue.enqueue(ds1);
  ImportReviewQueue.enqueue(ds2);

  // Validate, promote, and publish both
  StagingValidationEngine.validateDataset(ds1);
  ds1.status = 'APPROVED';
  StagingValidationEngine.promoteToRuntime(ds1, 'operator-1');
  ImportPublicationEngine.publish(ds1, 'operator-1');
  ds1.status = 'PUBLISHED';

  StagingValidationEngine.validateDataset(ds2);
  ds2.status = 'APPROVED';
  StagingValidationEngine.promoteToRuntime(ds2, 'operator-1');
  ImportPublicationEngine.publish(ds2, 'operator-1');
  ds2.status = 'PUBLISHED';

  // Execute snapshot rollback
  const justification = 'Desfazer todas as publicações ativas do tenant piloto para reinício da simulação.';
  const rollbackEntry = await PilotRollbackProtocol.rollbackTenantSnapshot(
    tenantId,
    'operator-1',
    justification
  );

  assert.strictEqual(rollbackEntry.scope, 'SNAPSHOT');

  // Verify all datasets in queue are demoted and returned to PENDING_REVIEW
  const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
  assert.strictEqual(queue.length, 2);
  queue.forEach(d => {
    assert.strictEqual(d.status, 'PENDING_REVIEW');
    assert.strictEqual(d.promotedToRuntime, false);
  });

  // Verify publications are marked reverted
  const pubs = ImportPublicationEngine.getAllPublications().filter(p => p.lineageReference.tenantId === tenantId);
  assert.strictEqual(pubs.length, 2);
  pubs.forEach(p => {
    assert.strictEqual(p.reverted, true);
    assert.strictEqual(p.revertedBy, 'operator-1');
    assert.strictEqual(p.reversionJustification, justification);
  });
});

test('Pilot Rollback Protocol - Governance Gate Enforcement', async () => {
  const tenantId = 'TENANT-PILOT-4';
  
  // Validation should throw if actorId is missing
  await assert.rejects(
    () => PilotRollbackProtocol.rollbackDataset('DS-401', tenantId, '', 'Justificativa longa o suficiente'),
    /actorId é obrigatório/
  );

  // Validation should throw if justification is too short
  await assert.rejects(
    () => PilotRollbackProtocol.rollbackDataset('DS-401', tenantId, 'operator-1', 'Curto'),
    /justificativa detalhada/
  );

  // Validation should throw if tenantId is missing
  await assert.rejects(
    () => PilotRollbackProtocol.rollbackDataset('DS-401', '', 'operator-1', 'Justificativa longa o suficiente'),
    /tenantId é obrigatório/
  );
});

test('Pilot Rollback Protocol - Operational Metrics Calculations', () => {
  const tenantId = 'TENANT-PILOT-5';
  ImportReviewQueue.clearMockDataForTenant(tenantId);
  ImportPublicationEngine.clearMockDataForTenant(tenantId);
  PilotRollbackProtocol.clearMockDataForTenant(tenantId);

  const ds1 = createBaseDataset('DS-501', tenantId);
  ds1.status = 'APPROVED';
  ds1.trustLevel = 'HIGH'; // numerical score 100
  ImportReviewQueue.enqueue(ds1);

  const ds2 = createBaseDataset('DS-502', tenantId);
  ds2.status = 'REVERTED';
  ds2.trustLevel = 'MEDIUM'; // numerical score 66
  ImportReviewQueue.enqueue(ds2);

  const metrics = PilotRollbackProtocol.calculateMetrics(tenantId);

  assert.strictEqual(metrics.totalUploads, 2);
  assert.strictEqual(metrics.approvalRate, 50); // 1 approved / 2 total
  assert.strictEqual(metrics.rejectionRate, 50); // 1 reverted / 2 total
  assert.strictEqual(metrics.averageConfidenceScore, 83); // (100 + 66) / 2 = 83
});
