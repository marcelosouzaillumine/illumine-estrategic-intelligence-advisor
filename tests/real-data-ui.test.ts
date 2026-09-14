import { test } from 'node:test';
import * as assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { StagingValidationEngine } from '../src/capabilities/runtime/integrations/StagingValidationEngine';
import { ImportPublicationEngine } from '../src/capabilities/runtime/integrations/ImportPublicationEngine';
import { ImportReviewQueue } from '../src/capabilities/runtime/integrations/ImportReviewQueue';
import { ImportedDataset } from '../src/capabilities/runtime/integrations/IntegrationGovernanceTypes';

const createBaseDataset = (isValid = true): ImportedDataset => ({
  importId: `TEST-BATCH-${Date.now()}`,
  datasetType: 'TRANSACTIONS_PAYABLES',
  connectorId: 'MANUAL_XLSX',
  tenantId: 'TENANT-1',
  workspaceId: 'WS-1',
  rawPayloadSize: 2048,
  extractedRecords: 2,
  trustLevel: 'LOW',
  status: 'PENDING_REVIEW',
  lineage: {
    tenantId: 'TENANT-1',
    workspaceId: 'WS-1',
    connectorId: 'MANUAL_XLSX',
    importId: 'TEST-BATCH-1',
    datasetHash: 'hash',
    sourceHash: 'source',
    mappingVersion: '1.0',
    timestamp: new Date().toISOString()
  },
  violations: [],
  submittedBy: 'tester',
  submittedAt: new Date().toISOString(),
  parsedData: {
    transactions: isValid 
      ? [
          { entidade: 'Fornecedor A', emissao: '2023-10-01', vencimento: '2023-10-15', valor: 1500.50 },
          { entidade: 'Fornecedor B', emissao: '2023-10-02', vencimento: '2023-10-20', valor: 300.00 }
        ]
      : [
          { entidade: '', emissao: '2023-10-01', vencimento: '2023-10-15', valor: 0 } // Invalid entity and value
        ]
  }
});

test('Real Data UI Onboarding Integration Protocol', async (t) => {
  
  await t.test('1. Upload válido gera StagingDataset que passa na validação', () => {
    const dataset = createBaseDataset(true);
    StagingValidationEngine.validateDataset(dataset);
    
    assert.strictEqual(dataset.stagingValidationPassed, true);
    assert.deepStrictEqual(dataset.blockingWarnings, []);
  });

  await t.test('2. Dataset inválido gera warnings e não pode ser promovido', () => {
    const dataset = createBaseDataset(false);
    StagingValidationEngine.validateDataset(dataset);
    
    assert.strictEqual(dataset.stagingValidationPassed, false);
    assert.ok(dataset.blockingWarnings!.includes('INVALID_TRANSACTION_AMOUNT'));
    assert.ok(dataset.blockingWarnings!.includes('MISSING_ENTITY'));
    
    // Attempting to promote should throw an error
    assert.throws(() => StagingValidationEngine.promoteToRuntime(dataset, 'user-1'));
  });

  await t.test('3. UI exibe os blocking warnings em caso de falha de validação', () => {
    const modalPath = path.join(process.cwd(), 'src/components/modals/ImportTransactionsModal.tsx');
    const modalCode = fs.readFileSync(modalPath, 'utf8');
    
    // Verify that the UI reads and maps staging warnings from dataset.blockingWarnings
    assert.ok(modalCode.includes('setValidationWarnings(dataset.blockingWarnings'));
    assert.ok(modalCode.includes('validationWarnings.length > 0'));
    assert.ok(modalCode.includes('O dataset foi bloqueado pela Governança de Staging'));
  });

  await t.test('4. Botão de promover fica bloqueado na UI se validationPassed = false', () => {
    const modalPath = path.join(process.cwd(), 'src/components/modals/ImportTransactionsModal.tsx');
    const modalCode = fs.readFileSync(modalPath, 'utf8');
    
    // Verify that the button is disabled when !validationPassed
    assert.ok(modalCode.includes('disabled={loading || !file || parsedData.length === 0 || !selectedClient || !validationPassed}'));
  });

  await t.test('5. Dataset aprovado e promovido chama o ImportPublicationEngine', () => {
    const modalPath = path.join(process.cwd(), 'src/components/modals/ImportTransactionsModal.tsx');
    const modalCode = fs.readFileSync(modalPath, 'utf8');
    
    // Verify that the code calls ImportPublicationEngine.publish
    assert.ok(modalCode.includes('ImportPublicationEngine.publish('));
    
    // Verify that enqueuing and publishing fiduciarily works end-to-end
    const dataset = createBaseDataset(true);
    StagingValidationEngine.validateDataset(dataset);
    assert.strictEqual(dataset.stagingValidationPassed, true);
    
    ImportReviewQueue.enqueue(dataset);
    StagingValidationEngine.promoteToRuntime(dataset, 'user-1');
    dataset.status = 'APPROVED';
    
    const publication = ImportPublicationEngine.publish(dataset, 'user-1');
    assert.ok(publication);
    assert.strictEqual(publication.importId, dataset.importId);
  });
});
