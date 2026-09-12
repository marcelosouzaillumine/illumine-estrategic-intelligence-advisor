import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CrossStatementValidator } from '../../capabilities/financial/runtime/financial-governance/validation/CrossStatementValidator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Cross Statement Consistency Contract', () => {
  it('must emit FIN-004 violation when Net Profit in DRE differs from DLPA', () => {
    const entries: any[] = [
      {
        id: 'dre-1',
        schemaVersion: '2.1.0',
        accountCode: '3.09',
        accountName: 'Lucro Líquido do Exercício',
        statementType: FinancialStatementType.DRE_ACCOUNTING,
        amount: 125000,
        year: 2026,
        clientId: 'c1',
        origin: 'MANUAL',
        classification: 'NET_PROFIT',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      },
      {
        id: 'dlpa-1',
        schemaVersion: '2.1.0',
        accountCode: '2.04',
        accountName: 'Lucro Líquido Transferido',
        statementType: FinancialStatementType.DLPA,
        amount: 117000, // Discrepancy!
        year: 2026,
        clientId: 'c1',
        origin: 'MANUAL',
        classification: 'NET_PROFIT',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      }
    ];

    const violations = CrossStatementValidator.validateCrossStatements(entries, 2026);

    const crossViolation = violations.find(v => v.code === 'FIN-004');
    assert.ok(crossViolation, 'FIN-004 cross statement inconsistency violation must be emitted');
    assert.strictEqual(crossViolation?.evidence?.difference, 8000);
  });
});
