import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CanonicalFinancialNormalizer } from '../../adapters/persistence/CanonicalFinancialNormalizer';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — Canonical Financial Normalizer Contract', () => {
  it('must convert raw legacy aliases (conta, valor, tipo) to Readonly<CanonicalFinancialEntry>', () => {
    const rawDoc = {
      id: 'doc-101',
      conta: 'Receita Bruta de Vendas',
      valor: 150000.50,
      tipo: 'DRE',
      exercicio: 2026,
      clientId: 'client-granatum'
    };

    const entry = CanonicalFinancialNormalizer.normalizeToCanonicalEntry(rawDoc);

    assert.strictEqual(entry.accountName, 'Receita Bruta de Vendas');
    assert.strictEqual(entry.amount, 150000.50);
    assert.strictEqual(entry.statementType, FinancialStatementType.DRE_ACCOUNTING);
    assert.strictEqual(entry.year, 2026);
    assert.strictEqual(entry.clientId, 'client-granatum');
    assert.strictEqual(entry.schemaVersion, '2.1.0');
    assert.ok(entry.lineage);
    assert.strictEqual(entry.lineage.normalizerVersion, '2.1.0');
  });

  it('must convert legacy category & val aliases correctly', () => {
    const rawDoc = {
      category: 'Ativo Circulante',
      val: 50000,
      type: 'BP',
      year: 2025,
      client_id: 'client-emporio'
    };

    const entry = CanonicalFinancialNormalizer.normalizeToCanonicalEntry(rawDoc);

    assert.strictEqual(entry.accountName, 'Ativo Circulante');
    assert.strictEqual(entry.amount, 50000);
    assert.strictEqual(entry.statementType, FinancialStatementType.BALANCE_SHEET);
    assert.strictEqual(entry.clientId, 'client-emporio');
  });
});
