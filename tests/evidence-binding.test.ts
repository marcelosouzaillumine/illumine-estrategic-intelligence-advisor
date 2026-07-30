import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveEvidenceBinding } from '../src/types/executive-recommendation-contract';

test('ExecutiveEvidenceBinding links statements to confidence and audit metrics', () => {
  const binding: ExecutiveEvidenceBinding = {
    id: 'EVI-101',
    conclusion: 'A margem EBITDA recuou 3.4 p.p. devido ao aumento no custo de insumos.',
    source: 'ERP / Balancete Contábil Auditado',
    period: 'Q2 2026',
    comparison: 'Q2 2026 vs Q2 2025',
    confidenceScore: 98,
    metrics: [
      { name: 'Margem EBITDA', value: '18.2%', trend: 'down', variance: '-3.4 p.p.' },
      { name: 'Custo de Vendas (CPV)', value: 'R$ 8.4M', trend: 'up', variance: '+12%' },
    ],
  };

  assert.equal(binding.confidenceScore, 98);
  assert.equal(binding.metrics.length, 2);
  assert.equal(binding.metrics[0].trend, 'down');
});
