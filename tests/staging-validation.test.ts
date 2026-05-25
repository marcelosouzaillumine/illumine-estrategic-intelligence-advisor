import { test } from 'node:test';
import * as assert from 'node:assert';
import { StagingValidationEngine } from '../src/core/runtime/integrations/StagingValidationEngine';
import { ImportedDataset } from '../src/core/runtime/integrations/IntegrationGovernanceTypes';
import { ImportPublicationEngine } from '../src/core/runtime/integrations/ImportPublicationEngine';

const createBaseDataset = (): ImportedDataset => ({
  importId: `TEST-${Date.now()}`,
  connectorId: 'MANUAL_CSV',
  tenantId: 'TENANT-1',
  workspaceId: 'WS-1',
  rawPayloadSize: 1000,
  extractedRecords: 10,
  trustLevel: 'UNVERIFIED',
  status: 'APPROVED',
  lineage: {
    tenantId: 'TENANT-1',
    workspaceId: 'WS-1',
    connectorId: 'MANUAL_CSV',
    importId: 'TEST-1',
    datasetHash: 'hash',
    sourceHash: 'hash',
    mappingVersion: '1.0',
    timestamp: new Date().toISOString()
  },
  violations: [],
  submittedBy: 'tester',
  submittedAt: new Date().toISOString()
});

test('Staging Validation - Valid Dataset Promoted', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    bp: { ativo: 1000, passivo: 600, pl: 400 },
    dre: { grossRevenue: 500, deductions: -100, netRevenue: 400, costs: -200 },
    dfc: { initialCash: 100, operatingFlow: 50, investingFlow: -20, financingFlow: 0, finalCash: 130 },
    accountList: [
      { id: '1', name: 'Ativo' },
      { id: '1.1', name: 'Caixa', parentId: '1' }
    ]
  };

  StagingValidationEngine.validateDataset(dataset);
  
  assert.strictEqual(dataset.stagingValidationPassed, true);
  assert.strictEqual(dataset.blockingWarnings?.length, 0);

  StagingValidationEngine.promoteToRuntime(dataset, 'admin');
  assert.strictEqual(dataset.promotedToRuntime, true);

  const publication = ImportPublicationEngine.publish(dataset, 'admin');
  assert.ok(publication);
});

test('Staging Validation - Unbalanced BP (INVALID_BALANCE_SHEET)', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    bp: { ativo: 1000, passivo: 600, pl: 500 } // Diff 100 > 5% of 1000
  };

  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, false);
  assert.ok(dataset.blockingWarnings?.includes('INVALID_BALANCE_SHEET'));
  
  assert.throws(() => StagingValidationEngine.promoteToRuntime(dataset, 'admin'));
});

test('Staging Validation - DRE Hierarchy Break (HIERARCHY_BREAK)', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    dre: { grossRevenue: 500, deductions: -100, netRevenue: 300 } // 500 - 100 = 400 != 300
  };

  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, false);
  assert.ok(dataset.blockingWarnings?.includes('HIERARCHY_BREAK'));
});

test('Staging Validation - Duplicate Account', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    bp: { ativo: 100, passivo: 50, pl: 50 },
    accountList: [
      { id: '1', name: 'Ativo' },
      { id: '1', name: 'Ativo Duplicado' }
    ]
  };

  StagingValidationEngine.validateDataset(dataset);
  // Duplicate account is not in blocking rules by default but generates a warning
  assert.ok(dataset.blockingWarnings?.includes('DUPLICATE_ACCOUNT'));
});

test('Staging Validation - Orphan Account', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    bp: { ativo: 100, passivo: 50, pl: 50 },
    accountList: [
      { id: '1.1', name: 'Caixa', parentId: '1' } // '1' does not exist
    ]
  };

  StagingValidationEngine.validateDataset(dataset);
  assert.ok(dataset.blockingWarnings?.includes('ORPHAN_ACCOUNT'));
});

test('Staging Validation - Sign Inversion', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    dre: { grossRevenue: 500, deductions: -100, netRevenue: 400, costs: 200 } // Costs > 0
  };

  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, false);
  assert.ok(dataset.blockingWarnings?.includes('SIGN_INVERSION'));
});

test('Staging Validation - Incomplete Dataset', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {};

  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, false);
  assert.ok(dataset.blockingWarnings?.includes('INCOMPLETE_DATASET'));
});

test('Staging Validation - Publish Blocked on Unpromoted Dataset', () => {
  const dataset = createBaseDataset();
  dataset.parsedData = {
    bp: { ativo: 1000, passivo: 600, pl: 400 }
  };

  StagingValidationEngine.validateDataset(dataset);
  assert.strictEqual(dataset.stagingValidationPassed, true);
  assert.strictEqual(dataset.promotedToRuntime, false);

  const publication = ImportPublicationEngine.publish(dataset, 'admin');
  assert.strictEqual(publication, null);
});
