import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveDecisionMonitoringState } from '../src/types/executive-recommendation-contract';

test('ExecutiveDecisionMonitoringState tracks expected vs actual KPI shift', () => {
  const state: ExecutiveDecisionMonitoringState = {
    id: 'MON-001',
    recommendationId: 'REC-2026-001',
    decisionTaken: 'Renegociação de Dívida de Curto Prazo',
    expectedShift: {
      pessimistic: '+R$ 500k',
      expected: '+R$ 1.2M',
      optimistic: '+R$ 1.8M',
    },
    monitoringMetrics: ['Liquidez Imediata'],
    actualShift: '+R$ 1.35M',
    learningNote: 'Redução de taxas obtida acima da meta por antecipação de garantia.',
    monitoringStatus: 'verified',
    lastEvaluatedAt: '2026-07-30',
  };

  assert.equal(state.monitoringStatus, 'verified');
  assert.equal(state.actualShift, '+R$ 1.35M');
  assert.ok(state.learningNote?.includes('garantia'));
});
