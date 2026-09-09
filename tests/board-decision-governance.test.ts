// tests/board-decision-governance.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BoardResolutionEngine } from '../src/core/runtime/board-decision/BoardResolutionEngine';
import { DecisionLineageTracker } from '../src/core/runtime/board-decision/DecisionLineageTracker';
import { InstitutionalScenarioResult } from '../src/core/runtime/scenario-intelligence/scenario-types';

describe('RC-1.7 - Board Decision Governance & Governance', () => {

  const validScenario: InstitutionalScenarioResult = {
    id: 'SCEN-TEST-1',
    inputs: [],
    validation: { status: 'VALID' },
    propagationProfile: {
      nodes: [],
      edges: [],
      structuralIntegrityScore: 85,
      systemicSeverity: 'MODERADA'
    },
    explainability: {
      baselineHash: 'B-HASH-1',
      simulationHash: 'S-HASH-1',
      lineageHash: 'L-HASH-VALID-123',
      constraintTriggers: [],
      propagationRationale: []
    }
  };

  const invalidScenario: InstitutionalScenarioResult = {
    id: 'SCEN-TEST-2',
    inputs: [],
    validation: { status: 'BLOCKED_BY_EXTRAPOLATION' }
  };

  it('Deve rejeitar formalização de resolução se o cenário for inválido', () => {
    assert.throws(() => {
      BoardResolutionEngine.formalizeResolution('T1', 'C1', invalidScenario, 'Racional válido longo suficiente.', 'U1', 'Master');
    }, /FIDUCIARY_VIOLATION/);
  });

  it('Deve formalizar uma resolução válida e carregar o Lineage Hash corretamente', () => {
    const res = BoardResolutionEngine.formalizeResolution('T1', 'C1', validScenario, 'Este racional fiduciário é longo o suficiente para passar no teste de validação.', 'U1', 'Master');
    
    assert.equal(res.status, 'APPROVED');
    assert.equal(res.scenarioLineageHash, 'L-HASH-VALID-123');
    assert.ok(res.resolutionHash);
  });

  it('DecisionLineageTracker deve acusar TAMPERED se o hash ou ID for mutado', () => {
    const res = BoardResolutionEngine.formalizeResolution('T1', 'C1', validScenario, 'Este racional fiduciário é longo o suficiente para passar no teste de validação.', 'U1', 'Master');
    
    assert.ok(DecisionLineageTracker.verifyLineage(res), 'Deve ser válido inicialmente');

    // Mutar cenário
    res.scenarioLineageHash = 'L-HASH-HACKED-999';
    assert.ok(!DecisionLineageTracker.verifyLineage(res), 'Deve ser inválido após adulteração');
  });

});
