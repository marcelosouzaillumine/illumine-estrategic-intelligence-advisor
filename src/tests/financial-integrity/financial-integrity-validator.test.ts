import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FinancialIntegrityValidator } from '../../core/runtime/financial-governance/validation/FinancialIntegrityValidator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Financial Integrity Validator Contract', () => {
  it('must detect duplicate account codes and rejected status entries', () => {
    const entries: any[] = [
      {
        id: 'e1',
        schemaVersion: '2.1.0',
        accountCode: '3.01',
        accountName: 'Receita Líquida',
        statementType: FinancialStatementType.DRE_ACCOUNTING,
        amount: 1000,
        year: 2026,
        clientId: 'c1',
        origin: 'MANUAL',
        classification: 'REV',
        status: 'APPROVED',
        lineage: { sourceCollection: 'financial_entries' }
      },
      {
        id: 'e2',
        schemaVersion: '2.1.0',
        accountCode: '3.01', // Duplicate!
        accountName: 'Receita Duplicada',
        statementType: FinancialStatementType.DRE_ACCOUNTING,
        amount: 500,
        year: 2026,
        clientId: 'c1',
        origin: 'MANUAL',
        classification: 'REV',
        status: 'REJECTED', // Rejected!
        lineage: { sourceCollection: 'financial_entries' }
      }
    ];

    const violations = FinancialIntegrityValidator.validate(
      entries,
      'c1',
      FinancialStatementType.DRE_ACCOUNTING,
      2026
    );

    const dupViolation = violations.find(v => v.code === 'FIN-001' && v.message.includes('Duplicate'));
    const rejViolation = violations.find(v => v.code === 'FIN-009');

    assert.ok(dupViolation, 'Duplicate account code violation FIN-001 must be emitted');
    assert.ok(rejViolation, 'Rejected entry violation FIN-009 must be emitted');
  });
});
