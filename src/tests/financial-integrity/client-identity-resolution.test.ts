import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FinancialIntegrityValidator } from '../../capabilities/financial/runtime/financial-governance/validation/FinancialIntegrityValidator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Client Identity Resolution Contract', () => {
  it('must emit FIN-002 violation when clientId mismatch occurs', () => {
    const entries: any[] = [
      {
        id: 'entry-1',
        schemaVersion: '2.1.0',
        accountCode: '3.01',
        accountName: 'Vendas',
        statementType: FinancialStatementType.DRE_ACCOUNTING,
        amount: 100,
        year: 2026,
        clientId: 'client-wrong',
        origin: 'MANUAL',
        classification: 'REVENUE',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      }
    ];

    const violations = FinancialIntegrityValidator.validate(
      entries,
      'client-expected',
      FinancialStatementType.DRE_ACCOUNTING,
      2026
    );

    const clientViolation = violations.find(v => v.code === 'FIN-002');
    assert.ok(clientViolation, 'FIN-002 client mismatch violation must be emitted');
    assert.strictEqual(clientViolation?.severity, 'CRITICAL');
  });
});
