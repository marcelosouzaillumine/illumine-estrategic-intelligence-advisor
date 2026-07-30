import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CanonicalFinancialNormalizer } from '../../adapters/persistence/CanonicalFinancialNormalizer';

describe('CFDI v2.1 — Financial Lineage Metadata Contract', () => {
  it('must populate complete lineage metadata during normalization', () => {
    const raw = {
      id: 'doc-lineage-1',
      conta: 'EBITDA',
      valor: 25000,
      tipo: 'DRE',
      year: 2026,
      clientId: 'client-100',
      sourceCollection: 'financial_entries_custom'
    };

    const entry = CanonicalFinancialNormalizer.normalizeToCanonicalEntry(raw);

    assert.ok(entry.lineage);
    assert.strictEqual(entry.lineage.sourceCollection, 'financial_entries_custom');
    assert.strictEqual(entry.lineage.sourceDocumentId, 'doc-lineage-1');
    assert.strictEqual(entry.lineage.normalizerVersion, '2.1.0');
    assert.strictEqual(entry.lineage.generatedBy, 'CanonicalFinancialNormalizer');
  });
});
