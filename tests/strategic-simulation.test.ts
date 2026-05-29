// tests/strategic-simulation.test.ts
//
// Strategic Simulation Framework Test Suite
// Verifies multi-path forecasts, scenario stress collapse, resilience ranking, and trace lineage.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StrategicSimulationEngine } from '../src/core/runtime/strategic-simulation/StrategicSimulationEngine';
import { ScenarioStressEngine } from '../src/core/runtime/strategic-simulation/ScenarioStressEngine';
import { ResilienceOptimizationEngine } from '../src/core/runtime/strategic-simulation/ResilienceOptimizationEngine';
import { InstitutionalOptimizationEngine } from '../src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine';
import { ExecutiveScenarioEngine } from '../src/core/runtime/strategic-simulation/ExecutiveScenarioEngine';
import { ExecutiveDecision } from '../src/core/runtime/decision-intelligence/decision-types';

const createBaseReportContext = () => ({
  scores: {
    financial: 80,
    operational: 80,
    governance: 75,
    structural: 85,
    composite: 80
  },
  metrics: {
    ebitda: 1500,
    netIncome: 1200,
    retentionRatio: 0.5,
    netMargin: 15,
    margin: 15,
    availableCash: 120000
  },
  severity: { level: 'ESTÁVEL' },
  compliance: { confidenceLevel: 'HIGH_CONFIDENCE' },
  cashFlowReport: {
    isAvailable: true,
    operational: { fco: 15000 },
    investment: { fci: -2000 },
    availableCash: 120000,
    confidence: 'HIGH_CONFIDENCE'
  },
  capitalGovernanceReport: {
    isAvailable: true,
    preservation: { preservationStatus: 'PRESERVAÇÃO_SAUDÁVEL' },
    behavior: { governanceMaturity: 'MATURA' },
    confidence: 'HIGH_CONFIDENCE'
  }
});

const createBaseDecision = (domains: any[] = ['CAPEX']): ExecutiveDecision => ({
  decisionId: `DEC-SIM-TEST-${Date.now()}`,
  tenantId: 'TENANT-A',
  clientId: 'CLIENT-1',
  domains,
  value: 8000,
  motivation: 'Projeto piloto de expansão tecnológica.',
  assumptions: ['Mercado propício', 'Retorno em 12 meses'],
  expectedOutcomes: ['Aumento de eficiência'],
  timestamp: new Date().toISOString(),
  approverId: 'USR-CEO',
  approverRole: 'CEO'
});

describe('Executive Scenario & Strategic Simulation Framework', () => {

  describe('1. Multi-Path Simulation Horizons', () => {
    it('Deve executar simulação com horizonte de 3 ciclos', () => {
      const report = createBaseReportContext();
      const path = StrategicSimulationEngine.simulate('Conservative Preservation', 3, report);

      assert.equal(path.horizon, 3);
      assert.ok(path.traceHash);
      assert.ok(path.finalSurvivabilityScores);
    });

    it('Deve executar simulação com horizonte de 12 ciclos', () => {
      const report = createBaseReportContext();
      const path = StrategicSimulationEngine.simulate('Conservative Preservation', 12, report);

      assert.equal(path.horizon, 12);
      assert.ok(path.traceHash);
      assert.ok(path.finalSurvivabilityScores);
    });
  });

  describe('2. Scenario Stress and Collapse', () => {
    it('Deve aplicar estresse moderado e reduzir OCF em 15%', () => {
      const report = createBaseReportContext();
      const result = ScenarioStressEngine.applyStress(report, 'MODERATE');

      assert.equal(result.stressedReport.ocf ?? result.stressedReport.cashFlowReport.operational.fco, 12750); // 15000 * 0.85
      assert.ok(result.assumptions.some(a => a.includes('Operating Cash Flow reduced by 15%')));
    });

    it('Deve aplicar estresse extremo e rebaixar caminho agressivo para UNSUSTAINABLE ou COLLAPSE_TRAJECTORY', () => {
      const report = createBaseReportContext();
      // Setup aggressive leverage / cash strain initial report
      report.scores.financial = 45;
      report.cashFlowReport.operational.fco = -10000; // Negative FCO to trigger higher vulnerability
      report.capitalGovernanceReport.behavior.governanceMaturity = 'FRÁGIL';

      const path = StrategicSimulationEngine.simulate(
        'Aggressive Expansion',
        5,
        report,
        'EXTREME'
      );

      assert.ok(
        path.classification === 'UNSUSTAINABLE' || path.classification === 'COLLAPSE_TRAJECTORY',
        `Should be marked unsustainable or collapse trajectory under extreme stress, got ${path.classification}`
      );
    });
  });

  describe('3. Resilience Optimization & Ranking', () => {
    it('Deve preferir estratégias de preservação em detrimento de expansão agressiva sob estresse financeiro', () => {
      const report = createBaseReportContext();
      report.scores.financial = 40;
      report.cashFlowReport.operational.fco = -12000;

      // Simulate alternative paths under SEVERE stress
      const expansionPath = StrategicSimulationEngine.simulate('Aggressive Expansion', 5, report, 'SEVERE');
      const preservationPath = StrategicSimulationEngine.simulate('Conservative Preservation', 5, report, 'SEVERE');
      const stabilizationPath = StrategicSimulationEngine.simulate('Survival Stabilization', 5, report, 'SEVERE');

      const optimization = InstitutionalOptimizationEngine.selectOptimalPath(
        expansionPath,
        [preservationPath, stabilizationPath]
      );

      // Expansion should be ineligible or rank lower than stabilization/preservation
      assert.notEqual(optimization.optimalCategory, 'Aggressive Expansion');
      assert.ok(
        optimization.optimalCategory === 'Survival Stabilization' || 
        optimization.optimalCategory === 'Conservative Preservation',
        `Optimal category should be stabilization or preservation, got ${optimization.optimalCategory}`
      );
    });

    it('Deve calcular Recovery Viability Index maior para Survival Stabilization do que para Aggressive Expansion', () => {
      const report = createBaseReportContext();
      report.scores.financial = 35;
      report.cashFlowReport.operational.fco = -8000;

      const expansionPath = StrategicSimulationEngine.simulate('Aggressive Expansion', 5, report, 'SEVERE');
      const stabilizationPath = StrategicSimulationEngine.simulate('Survival Stabilization', 5, report, 'SEVERE');

      const expansionViability = ResilienceOptimizationEngine.calculateRecoveryViability(expansionPath);
      const stabilizationViability = ResilienceOptimizationEngine.calculateRecoveryViability(stabilizationPath);

      assert.ok(stabilizationViability > expansionViability, `Stabilization (${stabilizationViability}) should be more viable than Expansion (${expansionViability})`);
    });
  });

  describe('4. Lineage and Traceability', () => {
    it('Deve gerar trace hashes únicos para diferentes perfis de estresse', () => {
      const report = createBaseReportContext();

      const pathModerate = StrategicSimulationEngine.simulate('Controlled Growth', 5, report, 'MODERATE');
      const pathSevere = StrategicSimulationEngine.simulate('Controlled Growth', 5, report, 'SEVERE');

      assert.notEqual(pathModerate.traceHash, pathSevere.traceHash, 'Hashes should be unique for different stress profiles');
      assert.equal(pathModerate.stressProfileApplied, 'MODERATE');
      assert.equal(pathSevere.stressProfileApplied, 'SEVERE');
    });

    it('Deve orquestrar simulação executiva de decisão proposta e retornar comparação contra baselines', () => {
      const decision = createBaseDecision(['CAPEX']);
      const report = createBaseReportContext();

      const reportComparison = ExecutiveScenarioEngine.simulateAndCompare(decision, report, 5, 'SEVERE');

      assert.ok(reportComparison.candidatePath);
      assert.ok(reportComparison.baselines.conservativePreservation);
      assert.ok(reportComparison.baselines.controlledGrowth);
      assert.ok(reportComparison.baselines.survivalStabilization);
      assert.ok(reportComparison.recommendedPath);
      assert.ok(reportComparison.uncertaintyBoundaries);
      assert.ok(reportComparison.advisoryNotes.length > 0);
    });
  });
});
