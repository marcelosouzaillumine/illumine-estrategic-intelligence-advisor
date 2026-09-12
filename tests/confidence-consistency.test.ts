import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CalibrationEngine } from '../src/core/runtime/calibration/CalibrationEngine';
import { ConfidenceTelemetryEngine } from '../src/platform/observability/ConfidenceTelemetryEngine';
import { PredictiveStressEngine } from '../src/core/runtime/scenario/PredictiveStressEngine';
import { ScenarioConfidenceProjector } from '../src/core/runtime/scenario/ScenarioConfidenceProjector';
import { ConsolidatedFinancialInput } from '../src/core/runtime/consolidated/types';
import { ScenarioPropagationResult } from '../src/core/runtime/scenario/ScenarioTypes';

describe('Phase 9: Confidence Consistency & Parameter Sensitivity Tests', () => {
  beforeEach(() => {
    CalibrationEngine.resetToDefault();
  });

  it('1. Deve reportar degradação e colapso de confiança consistentes com o perfil ativo', () => {
    const telemetry = new ConfidenceTelemetryEngine();

    // 1.1 Balanced Profile (degrade = 0.65, collapse = 0.45)
    CalibrationEngine.applyProfile('balanced', 'usr_test', 'Applying baseline for telemetry validation');
    telemetry.setBaseConfidence(100);
    telemetry.applyPenalty(40, 'Data Issue A'); // Score: 60 (0.60)
    
    let state = telemetry.getTelemetry();
    assert.strictEqual(state.isDegraded, true);      // 0.60 < 0.65
    assert.strictEqual(state.confidenceCollapse, false); // 0.60 >= 0.45

    // 1.2 Conservative Profile (degrade = 0.75, collapse = 0.55)
    CalibrationEngine.applyProfile('conservative', 'usr_test', 'Applying conservative for strict telemetry validation');
    // Note: Telemetry needs to query the active threshold dynamically, which it does from CalibrationEngine
    state = telemetry.getTelemetry();
    assert.strictEqual(state.isDegraded, true);      // 0.60 < 0.75
    assert.strictEqual(state.confidenceCollapse, false); // 0.60 >= 0.55 is false
    // Wait, let's apply another penalty of 10. Score: 50 (0.50)
    telemetry.applyPenalty(10, 'Data Issue B');
    state = telemetry.getTelemetry();
    assert.strictEqual(state.isDegraded, true);      // 0.50 < 0.75
    assert.strictEqual(state.confidenceCollapse, true);  // 0.50 < 0.55 is true

    // 1.3 Aggressive Profile (degrade = 0.55, collapse = 0.35)
    CalibrationEngine.applyProfile('aggressive', 'usr_test', 'Applying aggressive for tolerant telemetry validation');
    state = telemetry.getTelemetry();
    assert.strictEqual(state.isDegraded, true);      // 0.50 < 0.55
    assert.strictEqual(state.confidenceCollapse, false); // 0.50 >= 0.35
  });

  it('2. Deve modular limites de insolvência no PredictiveStressEngine baseando-se na sensibilidade', () => {
    const mockInput: ConsolidatedFinancialInput = {
      groupId: 'grp-test',
      fiscalYear: '2023',
      entities: [{ id: 'ENT-A', name: 'Entidade A', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' }],
      bpByEntity: {
        'ENT-A': [
          { accountId: '1.1.1', category: 'CAIXA_EQUIVALENTES', value: 10 }, // Cash = 10
          { accountId: '2.1', category: 'PASSIVO_CIRCULANTE', value: 200 }   // ST Debt = 200. Ratio: 10/200 = 0.05
        ]
      },
      dreByEntity: {},
      consolidationScope: ['ENT-A'],
      topologySnapshot: { nodes: [], edges: [] } as any,
      confidenceByEntity: { 'ENT-A': 'HIGH' as any },
      sourceMetadata: {}
    };

    // 2.1 Balanced Profile (sensitivity = 1.0, limit = 0.05 * 1 = 0.05)
    // Debt = 200, Cash = 10. cash < (200 * 0.05) is 10 < 10 (false) -> surviving.
    CalibrationEngine.applyProfile('balanced', 'usr_test', 'Balanced profile for stress engine test');
    let stress = PredictiveStressEngine.evaluateStress(mockInput);
    assert.strictEqual(stress.collapsedEntities.length, 0);

    // 2.2 Conservative Profile (sensitivity = 1.5, limit = 0.05 * 1.5 = 0.075)
    // Debt = 200, Cash = 10. cash < (200 * 0.075 = 15) is 10 < 15 (true) -> collapsed.
    CalibrationEngine.applyProfile('conservative', 'usr_test', 'Conservative profile for stress engine test');
    stress = PredictiveStressEngine.evaluateStress(mockInput);
    assert.strictEqual(stress.collapsedEntities.length, 1);
    assert.strictEqual(stress.collapsedEntities[0], 'ENT-A');
  });

  it('3. Deve estender ou encurtar o horizonte crítico no ScenarioConfidenceProjector', () => {
    const propagation: ScenarioPropagationResult = {
      projectedConfidence: 'HIGH',
      propagatedViolations: [],
      stressResult: {
        monthsToLiquidityCrisis: 4, // Liquidity crisis in 4 months
        survivingEntities: [],
        collapsedEntities: [],
        groupSolvencyStatus: 'SOLVENT',
        estimatedCashBurnRate: 100
      }
    };

    // 3.1 Balanced Profile (sensitivity = 1.0, limit = max(round(3 * 1.0), 1) = 3 months)
    // Crisis in 4 months > limit of 3 -> retains original projected confidence 'HIGH'
    CalibrationEngine.applyProfile('balanced', 'usr_test', 'Balanced profile for projector test');
    let result = ScenarioConfidenceProjector.project('HIGH', propagation);
    assert.strictEqual(result, 'HIGH');

    // 3.2 Conservative Profile (sensitivity = 1.5, limit = max(round(3 * 1.5), 1) = 5 months)
    // Crisis in 4 months <= limit of 5 -> forced to 'CRITICAL_STRESS'
    CalibrationEngine.applyProfile('conservative', 'usr_test', 'Conservative profile for projector test');
    result = ScenarioConfidenceProjector.project('HIGH', propagation);
    assert.strictEqual(result, 'CRITICAL_STRESS');
  });
});
