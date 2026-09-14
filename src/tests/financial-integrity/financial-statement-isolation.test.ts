import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FinancialIntegrityValidator } from '../../capabilities/financial/runtime/financial-governance/validation/FinancialIntegrityValidator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Financial Statement Isolation Contract', () => {
  it('must emit FIN-003 violation when DRE entries contaminate Balance Sheet query', () => {
    const invalidEntries: any[] = [
      {
        id: 'entry-bp-1',
        schemaVersion: '2.1.0',
        accountCode: '1.01',
        accountName: 'Caixa',
        statementType: FinancialStatementType.BALANCE_SHEET,
        amount: 1000,
        year: 2026,
        clientId: 'client-1',
        origin: 'MANUAL',
        classification: 'ACTIVE',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      },
      {
        id: 'entry-dre-1',
        schemaVersion: '2.1.0',
        accountCode: '3.01',
        accountName: 'Receita',
        statementType: FinancialStatementType.DRE_ACCOUNTING, // Contamination!
        amount: 5000,
        year: 2026,
        clientId: 'client-1',
        origin: 'MANUAL',
        classification: 'REVENUE',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      }
    ];

    const violations = FinancialIntegrityValidator.validate(
      invalidEntries,
      'client-1',
      FinancialStatementType.BALANCE_SHEET,
      2026
    );

    const isolationViolation = violations.find(v => v.code === 'FIN-003');
    assert.ok(isolationViolation, 'FIN-003 isolation violation must be emitted');
    assert.strictEqual(isolationViolation?.severity, 'CRITICAL');
  });
});
