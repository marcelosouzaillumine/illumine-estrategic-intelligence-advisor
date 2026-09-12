import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SimulationInput, SandboxConfig } from '../src/capabilities/runtime/scenario-simulation/types';
import { ScenarioMacroProjectionEngine } from '../src/capabilities/runtime/scenario-simulation/ScenarioMacroProjectionEngine';
import { GovernanceForecastEngine } from '../src/capabilities/runtime/scenario-simulation/GovernanceForecastEngine';
import { PropagationSimulationEngine } from '../src/capabilities/runtime/scenario-simulation/PropagationSimulationEngine';
import { StrategicDecisionSandbox } from '../src/capabilities/runtime/scenario-simulation/StrategicDecisionSandbox';

const getMockInput = (): SimulationInput => ({
  scenarioType: 'LIQUIDITY_STRESS',
  horizon: '90_DAYS',
  tenantId: 'test-tenant-abc',
  entityId: 'test-entity-xyz',
  baseFinancials: {
    caixaEquivalentes: 200000,
    receitaLiquida: 800000,
    despesasFixas: 300000,
    custosVar: 400000
  },
  historicalCycles: [
    { period: '2026-Q1', maturityScore: 80, anomaliesCount: 1, violationsCount: 0, cashValue: 200000, netMargin: 0.05, lineageHash: 'hash-1' },
    { period: '2025-Q4', maturityScore: 85, anomaliesCount: 0, violationsCount: 0, cashValue: 240000, netMargin: 0.06, lineageHash: 'hash-2' },
    { period: '2025-Q3', maturityScore: 90, anomaliesCount: 2, violationsCount: 1, cashValue: 290000, netMargin: 0.07, lineageHash: 'hash-3' }
  ],
  activeEscalationLevel: 'MANAGEMENT_ACTION',
  lineageHash: 'audit-lineage-123',
  correlationId: 'correlation-id-789'
});

describe('SSPGL - Scenario Simulation & Predictive Governance Layer', () => {

  describe('ScenarioMacroProjectionEngine', () => {
    it('should compute deterministic score, velocity, and escalation trajectory', () => {
      const input = getMockInput();
      const output = ScenarioMacroProjectionEngine.run(input);

      assert.strictEqual(output.tenantId, input.tenantId);
      assert.strictEqual(output.correlationId, input.correlationId);
      assert.strictEqual(output.lineageHash, input.lineageHash);
      assert.strictEqual(output.confidenceLevel, 'HIGH');
      assert.strictEqual(output.integrityState, 'VERIFIED');
      
      // Check deterministic terminology matches requirements
      assert.ok(output.projectedEscalation.trajectory.length >= 1);
      assert.ok(['LOW_RISK', 'MODERATE_RISK', 'HIGH_RISK', 'CRITICAL_RISK'].includes(output.projectedEscalation.deterministicRiskBand));
      assert.ok(['LOW', 'MEDIUM', 'HIGH', 'EXTREME'].includes(output.exposureProgression.level));
      assert.ok(['LIGHT', 'MODERATE', 'HIGH', 'EXTREME'].includes(output.stressClassification));
    });

    it('should fail-closed when lineageHash is missing', () => {
      const input = getMockInput();
      input.lineageHash = ''; // missing

      assert.throws(() => {
        ScenarioMacroProjectionEngine.run(input);
      }, /FAIL_CLOSED/);
    });

    it('should flag INSUFFICIENT_HISTORY when historicalCycles < 3', () => {
      const input = getMockInput();
      input.historicalCycles = input.historicalCycles.slice(0, 2); // 2 cycles < 3

      const output = ScenarioMacroProjectionEngine.run(input);
      assert.strictEqual(output.confidenceLevel, 'INSUFFICIENT_HISTORY');
      assert.strictEqual(output.integrityState, 'DEGRADED');
    });
  });

  describe('GovernanceForecastEngine', () => {
    it('should generate deterministic forecasts and liquidity days to crisis projection', () => {
      const input = getMockInput();
      const output = GovernanceForecastEngine.generateForecast(input);

      assert.strictEqual(output.tenantId, input.tenantId);
      assert.strictEqual(output.correlationId, input.correlationId);
      assert.strictEqual(output.lineageHash, input.lineageHash);
      assert.strictEqual(output.forecastConfidence, 'HIGH');
      
      assert.ok(output.liquidityDaysToCrisis >= 0);
      assert.ok(output.governanceInstabilityIndex >= 0 && output.governanceInstabilityIndex <= 100);
      assert.ok(output.operationalFatigueIndex >= 0 && output.operationalFatigueIndex <= 100);
      assert.ok(output.assumptions.length > 0);
      assert.ok(output.limitations.length > 0);
    });

    it('should fail-closed on GovernanceForecastEngine when correlationId is missing', () => {
      const input = getMockInput();
      input.correlationId = '';

      assert.throws(() => {
        GovernanceForecastEngine.generateForecast(input);
      }, /FAIL_CLOSED/);
    });

    it('should flag INSUFFICIENT_HISTORY on GovernanceForecastEngine when cycles < 3', () => {
      const input = getMockInput();
      input.historicalCycles = [input.historicalCycles[0]]; // 1 cycle

      const output = GovernanceForecastEngine.generateForecast(input);
      assert.strictEqual(output.forecastConfidence, 'INSUFFICIENT_HISTORY');
    });
  });

  describe('PropagationSimulationEngine', () => {
    it('should calculate contagion paths and prop chain steps deterministically', () => {
      const input = getMockInput();
      const baseScore = 55;
      const chain = PropagationSimulationEngine.calculateContagion(input, baseScore);

      assert.ok(chain.length > 1);
      assert.strictEqual(chain[0].step, 1);
      assert.strictEqual(chain[0].entityId, input.entityId);
      assert.strictEqual(chain[0].contagionType, 'DIRECT_SHOCK');
      
      // Step 2 is mapped
      assert.strictEqual(chain[1].step, 2);
      assert.ok(chain[1].entityId.startsWith(input.entityId));
      assert.ok(['CONTAINED', 'ELEVATED', 'CRITICAL', 'SYSTEMIC'].includes(chain[1].severity));
    });

    it('should fail-closed when correlationId is missing', () => {
      const input = getMockInput();
      input.correlationId = '';

      assert.throws(() => {
        PropagationSimulationEngine.calculateContagion(input, 50);
      }, /FAIL_CLOSED/);
    });
  });

  describe('StrategicDecisionSandbox', () => {
    it('should perform in-memory non-persistent simulations and adjust financials', () => {
      const input = getMockInput();
      const actions: SandboxConfig[] = [
        { actionType: 'HIRING_FREEZE', intensity: 0.8 },
        { actionType: 'DEBT_INCREASE', intensity: 0.5 }
      ];

      const originalFixedExpenses = input.baseFinancials.despesasFixas || 0;
      const originalCash = input.baseFinancials.caixaEquivalentes || 0;

      const result = StrategicDecisionSandbox.executeSandbox(input, actions);

      assert.strictEqual(result.isSandbox, true);
      assert.deepStrictEqual(result.appliedActions, actions);
      assert.strictEqual(result.originalOutput.tenantId, input.tenantId);

      // Verify that input financials were NOT mutated (in-memory only isolation)
      assert.strictEqual(input.baseFinancials.despesasFixas, originalFixedExpenses);
      assert.strictEqual(input.baseFinancials.caixaEquivalentes, originalCash);

      // Verify sandbox output has SANDBOX labels in assumptions and limitations
      assert.ok(result.simulatedOutput.assumptions[0].includes('SANDBOX'));
      assert.ok(result.simulatedOutput.limitations[0].includes('simulados'));
    });

    it('should fail-closed on Sandbox when tenantId is empty', () => {
      const input = getMockInput();
      input.tenantId = '';

      assert.throws(() => {
        StrategicDecisionSandbox.executeSandbox(input, []);
      }, /FAIL_CLOSED/);
    });
  });
});
