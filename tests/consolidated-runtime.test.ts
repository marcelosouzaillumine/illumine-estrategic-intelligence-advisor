import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveConsolidatedConfidence } from '../src/core/runtime/consolidated/EntityScopedConfidenceResolver';
import { propagateViolations } from '../src/core/runtime/consolidated/ConsolidatedViolationPropagator';
import { buildLineageTree } from '../src/core/runtime/consolidated/CrossEntityLineageResolver';
import { ConsolidatedRuntimeContext } from '../src/core/runtime/consolidated/ConsolidatedRuntimeContext';
import { ExecutiveIntelligenceRuntime } from '../src/core/runtime/executive-intelligence-runtime';

describe('Consolidated Financial Runtime - Phase 1 Contracts', () => {

  it('1. Runtime single-entity continua funcionando (Backward Compatibility)', () => {
    // The runtime handles single-entity transparently because the expanded fields are optional.
    const runtime = new ExecutiveIntelligenceRuntime();
    // Assuming we pass minimal valid data to mock the behavior
    const mockPayload = {
      isMockData: true,
      bpData: [{ category: 'Caixa', type: 'ativo', value: 100 }],
      dreData: []
    };
    
    // We expect the runtime to not crash and to return a report missing the optional consolidated fields
    const report = runtime.generateExecutiveReport(mockPayload);
    assert.equal(report.groupId, undefined);
    assert.equal(report.confidenceByEntity, undefined);
    assert.notEqual(report.severity, undefined); // Standard single-entity field
  });

  it('2. RuntimeOutput aceita lineage opcional', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    const mockPayload = {
      isMockData: true,
      bpData: [{ category: 'Caixa', type: 'ativo', value: 100 }],
      dreData: []
    };
    
    const report = runtime.generateExecutiveReport(mockPayload);
    // Assigning the optional field manually as if the orchestrator did it
    report.lineage = {
      'Receita Bruta': [
        { sourceEntityId: 'EntA', metricOrigin: 'DRE', originalValue: 1000, eliminatedValue: 200, consolidatedValue: 800 }
      ]
    };

    assert.notEqual(report.lineage, undefined);
    assert.equal(report.lineage!['Receita Bruta'][0].consolidatedValue, 800);
  });

  it('3. Confidence consolidada não pode ser maior que a menor confidence das entidades', () => {
    const confidences = {
      'EntityA': 'HIGH_CONFIDENCE' as const,
      'EntityB': 'MEDIUM_CONFIDENCE' as const,
      'EntityC': 'LOW_CONFIDENCE' as const
    };

    const resolved = resolveConsolidatedConfidence(confidences);
    
    assert.equal(resolved.overallLevel, 'LOW_CONFIDENCE');
    assert.notEqual(resolved.degradationReason, undefined);
    assert.ok(resolved.degradationReason!.includes('LOW'));
  });

  it('4. Violations individuais são propagadas para o consolidado', () => {
    const violationsByEntity = {
      'EntityA': [{ violationId: 'v1', severity: 'WARNING' as const, sourceEntityId: 'EntityA', propagatedToGroup: false, description: 'Margem baixa' }],
      'EntityB': [{ violationId: 'v2', severity: 'CRITICAL' as const, sourceEntityId: 'EntityB', propagatedToGroup: false, description: 'Covenant quebrado' }]
    };

    const propagated = propagateViolations(violationsByEntity);
    
    assert.equal(propagated.length, 2);
    assert.equal(propagated[0].propagatedToGroup, true);
    assert.equal(propagated[1].sourceEntityId, 'EntityB');
  });

  it('5. Lineage preserva origem da entidade', () => {
    const values = [
      { entityId: 'EntA', originalValue: 500, eliminatedValue: 0 },
      { entityId: 'EntB', originalValue: 300, eliminatedValue: 100 }
    ];

    const lineage = buildLineageTree('DRE_EBITDA', values);
    
    assert.equal(lineage.length, 2);
    assert.equal(lineage[0].sourceEntityId, 'EntA');
    assert.equal(lineage[1].consolidatedValue, 200); // 300 - 100
    assert.equal(lineage[1].metricOrigin, 'DRE_EBITDA');
  });

});
