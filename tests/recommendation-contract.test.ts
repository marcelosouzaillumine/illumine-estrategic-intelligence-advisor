import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveRecommendationContract } from '../src/types/executive-recommendation-contract';

test('ExecutiveRecommendationContract contains all required fields', () => {
  const rec: ExecutiveRecommendationContract = {
    id: 'REC-2026-001',
    decision: 'Renegociar dívida operacional de curto prazo',
    rationale: 'Reduzir a pressão de caixa no 3º trimestre através do alongamento do perfil de amortização.',
    evidence: ['Taxa de juros atual: 14.2% a.a.', 'Saldo de caixa livre: R$ 2.1M'],
    expectedKPIShift: {
      pessimistic: '+R$ 500k em liquidez',
      expected: '+R$ 1.2M em liquidez',
      optimistic: '+R$ 1.8M em liquidez',
    },
    owner: 'Diretor Financeiro (CFO)',
    timeframe: '90 dias',
    priority: 'critical',
    successCriteria: 'Preservação da linha d’água operacional acima de R$ 3.0M',
    monitoringMetrics: ['Liquidez Imediata', 'Índice de Cobertura de Juros'],
  };

  assert.equal(rec.id, 'REC-2026-001');
  assert.equal(rec.priority, 'critical');
  assert.equal(rec.expectedKPIShift.expected, '+R$ 1.2M em liquidez');
  assert.equal(rec.monitoringMetrics.length, 2);
});
