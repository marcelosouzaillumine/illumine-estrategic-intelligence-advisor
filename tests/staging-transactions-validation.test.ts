import { test, describe, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { StagingValidationEngine } from '../src/core/runtime/integrations/StagingValidationEngine';
import { ImportedDataset } from '../src/core/runtime/integrations/IntegrationGovernanceTypes';

test('Transactional Staging Validation Engine', async (t) => {
  let validPayablesDataset: ImportedDataset;

  beforeEach(() => {
    validPayablesDataset = {
      importId: 'test-batch-123',
      connectorId: 'MANUAL_XLSX',
      datasetType: 'TRANSACTIONS_PAYABLES',
      tenantId: 'tenant-1',
      workspaceId: 'workspace-1',
      rawPayloadSize: 1024,
      extractedRecords: 2,
      trustLevel: 'LOW',
      status: 'PENDING_REVIEW',
      lineage: {
        tenantId: 'tenant-1',
        workspaceId: 'workspace-1',
        connectorId: 'MANUAL_XLSX',
        importId: 'test-batch-123',
        datasetHash: 'hash',
        sourceHash: 'source',
        mappingVersion: '1.0',
        timestamp: new Date().toISOString()
      },
      violations: [],
      submittedBy: 'user-1',
      submittedAt: new Date().toISOString(),
      parsedData: {
        transactions: [
          { entidade: 'Fornecedor A', emissao: '2023-10-01', vencimento: '2023-10-15', valor: 1500.50 },
          { entidade: 'Fornecedor B', emissao: '2023-10-02', vencimento: '2023-10-20', valor: 300.00 }
        ]
      }
    };
  });

  t.test('deve passar um dataset de payables válido (payable válido passa)', () => {
    StagingValidationEngine.validateDataset(validPayablesDataset);
    
    assert.deepStrictEqual(validPayablesDataset.blockingWarnings, []);
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, true);
  });

  t.test('deve passar um dataset de receivables válido (receivable válido passa)', () => {
    const receivableDataset = { ...validPayablesDataset, datasetType: 'TRANSACTIONS_RECEIVABLES' as const };
    StagingValidationEngine.validateDataset(receivableDataset);
    
    assert.deepStrictEqual(receivableDataset.blockingWarnings, []);
    assert.strictEqual(receivableDataset.stagingValidationPassed, true);
  });

  t.test('deve bloquear se o valor for zero ou inválido (valor inválido bloqueia)', () => {
    validPayablesDataset.parsedData.transactions[0].valor = 0;
    validPayablesDataset.parsedData.transactions[1].valor = "not-a-number";

    StagingValidationEngine.validateDataset(validPayablesDataset);

    assert.ok(validPayablesDataset.blockingWarnings?.includes('INVALID_TRANSACTION_AMOUNT'));
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, false);
  });

  t.test('deve gerar warning para vencimento ausente (vencimento ausente gera warning/bloqueio)', () => {
    validPayablesDataset.parsedData.transactions[0].vencimento = undefined;

    StagingValidationEngine.validateDataset(validPayablesDataset);

    assert.ok(validPayablesDataset.blockingWarnings?.includes('MISSING_DUE_DATE'));
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, true);
  });

  t.test('deve bloquear entidade ausente (entidade ausente bloqueia)', () => {
    validPayablesDataset.parsedData.transactions[0].entidade = '';

    StagingValidationEngine.validateDataset(validPayablesDataset);

    assert.ok(validPayablesDataset.blockingWarnings?.includes('MISSING_ENTITY'));
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, false);
  });

  t.test('deve bloquear ou alertar sobre duplicidade (duplicidade bloqueia)', () => {
    validPayablesDataset.parsedData.transactions.push({
      ...validPayablesDataset.parsedData.transactions[0]
    });

    StagingValidationEngine.validateDataset(validPayablesDataset);

    assert.ok(validPayablesDataset.blockingWarnings?.includes('DUPLICATE_TRANSACTION'));
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, false);
  });

  t.test('ausência de BP/DRE/DFC não bloqueia dataset transacional', () => {
    assert.strictEqual(validPayablesDataset.parsedData.bp, undefined);
    assert.strictEqual(validPayablesDataset.parsedData.dre, undefined);
    assert.strictEqual(validPayablesDataset.parsedData.dfc, undefined);

    StagingValidationEngine.validateDataset(validPayablesDataset);

    assert.strictEqual(validPayablesDataset.blockingWarnings?.includes('INCOMPLETE_DATASET'), false);
    assert.strictEqual(validPayablesDataset.stagingValidationPassed, true);
  });

  t.test('ImportTransactionsModal não publica direto no Runtime', () => {
    StagingValidationEngine.validateDataset(validPayablesDataset);
    assert.strictEqual(validPayablesDataset.promotedToRuntime, false);
    
    StagingValidationEngine.promoteToRuntime(validPayablesDataset, 'user-1');
    assert.strictEqual(validPayablesDataset.promotedToRuntime, true);
  });
});
