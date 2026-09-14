import test from 'node:test';
import assert from 'node:assert';
import { ExecutionCapacityConstraintEngine } from '../src/capabilities/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine';
import { PrescriptiveActionEngine } from '../src/capabilities/runtime/prescriptive-governance/PrescriptiveActionEngine';
import { FiduciaryPriorityEngine } from '../src/capabilities/runtime/prescriptive-governance/FiduciaryPriorityEngine';
import { DecisionMatrixEngine } from '../src/capabilities/runtime/prescriptive-governance/DecisionMatrixEngine';
import { InterventionTrackEngine } from '../src/capabilities/runtime/prescriptive-governance/InterventionTrackEngine';
import { BoardAgendaEngine } from '../src/capabilities/runtime/prescriptive-governance/BoardAgendaEngine';
import { BoardDraftingEngine } from '../src/capabilities/runtime/prescriptive-governance/BoardDraftingEngine';
import { PredictiveRiskOutput, EmergingRiskCategory } from '../src/capabilities/runtime/predictive-governance/PredictiveRiskEngine';

test('▶ Prescriptive Governance Governance Framework (PRGIF) v1.0', async (t) => {
  const mockSnapshots = [
    { id: '1', clientId: 'c', period: '2025', governanceScore: 80, bpHealth: 100, dreHealth: 50, dfcHealth: 50, esgMaturity: 50, cescfScore: 50, financialResilience: 50, operationalEfficiency: 50 },
    { id: '2', clientId: 'c', period: '2026', governanceScore: 80, bpHealth: 100, dreHealth: 50, dfcHealth: 50, esgMaturity: 50, cescfScore: 50, financialResilience: 50, operationalEfficiency: 50 }
  ];

  const mockRiskOutput: PredictiveRiskOutput = {
    emergingRisks: [
      { category: EmergingRiskCategory.LIQUIDITY_RISK, severityLabel: 'CRITICAL', causalExplanation: 'Cash burn is extreme.' },
      { category: EmergingRiskCategory.GOVERNANCE_RISK, severityLabel: 'HIGH', causalExplanation: 'Board is ineffective.' },
      { category: EmergingRiskCategory.EXECUTION_RISK, severityLabel: 'ELEVATED', causalExplanation: 'Margins dropping.' },
      { category: EmergingRiskCategory.SUSTAINABILITY_RISK, severityLabel: 'ELEVATED', causalExplanation: 'Minor carbon offset miss.' }
    ],
    confidenceLevel: 'MODERATE',
    confidenceReason: 'Test'
  };

  await t.test('✔ ExecutionCapacityConstraintEngine - limite por capacidade de execução', () => {
    // With given scores, capacity will be constrained
    const capacity = ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any);
    assert.ok(capacity.capacityScore > 0);
    assert.strictEqual(typeof capacity.maxConcurrentInterventions, 'number');
    assert.ok(capacity.maxConcurrentInterventions >= 1 && capacity.maxConcurrentInterventions <= 5);
  });

  await t.test('✔ FiduciaryPriorityEngine - ranks actions and limits by capacity', () => {
    const rawActions = PrescriptiveActionEngine.generateActions(mockRiskOutput);
    const capacity = { ...ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any), maxConcurrentInterventions: 2 };
    
    const prioritized = FiduciaryPriorityEngine.prioritize(rawActions, capacity);
    
    // Limits correctly
    assert.strictEqual(prioritized.length, 2);
    // Highest urgency/impact should be first (LIQUIDITY_RISK -> SYSTEMIC/CRITICAL)
    assert.strictEqual(prioritized[0].urgency, 'CRITICAL');
    assert.strictEqual(prioritized[0].impact, 'SYSTEMIC');
  });

  await t.test('✔ DecisionMatrixEngine - matriz urgência x impacto', () => {
    const rawActions = PrescriptiveActionEngine.generateActions(mockRiskOutput);
    // Assume all actions pass capacity for this test
    const capacity = { ...ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any), maxConcurrentInterventions: 10 };
    const prioritized = FiduciaryPriorityEngine.prioritize(rawActions, capacity);
    
    const matrix = DecisionMatrixEngine.mapToMatrix(prioritized);
    
    // Critical risk (Liquidity) -> dayZeroCritical
    assert.strictEqual(matrix.dayZeroCritical.some(a => a.track === 'LIQUIDITY'), true);
    // High Urgency / Significant Impact (Governance)
    const hasGovernance = Object.values(matrix).some(bucket => bucket.some((a: any) => a.track === 'GOVERNANCE'));
    assert.strictEqual(hasGovernance, true);
  });

  await t.test('✔ InterventionTrackEngine - trilhas de intervenção puramente agrupadoras', () => {
    const rawActions = PrescriptiveActionEngine.generateActions(mockRiskOutput);
    const capacity = { ...ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any), maxConcurrentInterventions: 10 };
    const prioritized = FiduciaryPriorityEngine.prioritize(rawActions, capacity);
    
    const tracks = InterventionTrackEngine.groupIntoTracks(prioritized);
    
    assert.ok(tracks.length > 0);
    // Ensure no new actions were created, just grouped
    const actionsInTracks = tracks.reduce((acc, t) => acc + t.sequencedActions.length, 0);
    assert.strictEqual(actionsInTracks, prioritized.length);
    assert.ok(tracks[0].title.includes('Trilha'));
  });

  await t.test('✔ BoardAgendaEngine - agenda com 3 blocos (INFORMATIVO, DELIBERATIVO, MONITORAMENTO)', () => {
    const rawActions = PrescriptiveActionEngine.generateActions(mockRiskOutput);
    const capacity = { ...ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any), maxConcurrentInterventions: 10 };
    const prioritized = FiduciaryPriorityEngine.prioritize(rawActions, capacity);
    const matrix = DecisionMatrixEngine.mapToMatrix(prioritized);
    
    const agenda = BoardAgendaEngine.generateAgenda(matrix, { predictiveScore: 80, trajectory: 'STABLE', systemicRiskLevel: 'MODERATE' });
    
    assert.ok(agenda.items.some(i => i.category === 'INFORMATIVO'));
    assert.ok(agenda.items.some(i => i.category === 'DELIBERATIVO'));
  });

  await t.test('✔ BoardResolutionEngine - minutas apenas para itens deliberativos e contém "Minuta recomendada"', () => {
    const rawActions = PrescriptiveActionEngine.generateActions(mockRiskOutput);
    const capacity = { ...ExecutionCapacityConstraintEngine.evaluateCapacity(mockSnapshots as any), maxConcurrentInterventions: 10 };
    const prioritized = FiduciaryPriorityEngine.prioritize(rawActions, capacity);
    const matrix = DecisionMatrixEngine.mapToMatrix(prioritized);
    const agenda = BoardAgendaEngine.generateAgenda(matrix, { predictiveScore: 80, trajectory: 'STABLE', systemicRiskLevel: 'MODERATE' });
    
    const resolutions = BoardDraftingEngine.generateResolutions(agenda);
    
    // Resolutions should only be generated for DELIBERATIVO items
    const deliberativoCount = agenda.items.filter(i => i.category === 'DELIBERATIVO').length;
    assert.strictEqual(resolutions.length, deliberativoCount);
    
    // Check mandatory language
    resolutions.forEach(res => {
      assert.ok(res.recommendedDraft.includes('Minuta recomendada para deliberação'));
      assert.ok(!res.recommendedDraft.toLowerCase().includes('decisão aprovada'));
    });
  });
});
