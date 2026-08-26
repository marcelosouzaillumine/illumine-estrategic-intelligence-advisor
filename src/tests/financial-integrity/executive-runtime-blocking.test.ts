import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FinancialPipelineOrchestrator } from '../../core/runtime/financial-governance/pipeline/FinancialPipelineOrchestrator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Executive Runtime Blocking & Permission Matrix Contract', () => {
  it('must allow EXECUTIVE_DECISION permission level when entries are clean and healthy', async () => {
    const validRawEntries = [
      {
        id: 'r1',
        conta: 'Receita Operacional Líquida',
        valor: 500000,
        tipo: 'DRE',
        exercicio: 2026,
        clientId: 'client-healthy'
      },
      {
        id: 'r2',
        conta: 'Lucro Líquido do Exercício',
        valor: 120000,
        tipo: 'DRE',
        exercicio: 2026,
        clientId: 'client-healthy'
      },
      {
        id: 'r3',
        conta: 'EBITDA',
        valor: 180000,
        tipo: 'DRE',
        exercicio: 2026,
        clientId: 'client-healthy'
      }
    ];

    const governance = await FinancialPipelineOrchestrator.processAndCertify(
      validRawEntries,
      [],
      'client-healthy',
      FinancialStatementType.DRE_ACCOUNTING,
      2026,
      '550e8400-e29b-41d4-a716-446655440000', // Mock Tenant ID
      '990e8400-e29b-41d4-a716-446655441111'  // Mock Actor ID
    );

    assert.strictEqual(governance.certificationStatus, 'CERTIFIED');
    assert.strictEqual(governance.runtimePermission, 'ALLOW');
    assert.ok(governance.dataset.datasetHash.startsWith('sha256-'));
    assert.strictEqual(governance.trustSignal.allowedDecisionLevel, 'EXECUTIVE_DECISION');
  });
});
