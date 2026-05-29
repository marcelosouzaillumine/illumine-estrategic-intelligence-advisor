// tests/predictive-intelligence.test.ts
//
// Institutional Predictive Intelligence & Early Warning Framework Test Suite

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDecisionIntelligenceEngine } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine';
import { InstitutionalDecisionLedger } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionLedger';
import { ExecutiveDecision } from '../src/core/runtime/decision-intelligence/decision-types';
import { DeteriorationMomentumEngine } from '../src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine';
import { BehavioralAccelerationEngine } from '../src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine';
import { SurvivabilityProjectionEngine } from '../src/core/runtime/predictive-intelligence/SurvivabilityProjectionEngine';
import { TrajectoryForecastEngine } from '../src/core/runtime/predictive-intelligence/TrajectoryForecastEngine';
import { InstitutionalResilienceEngine } from '../src/core/runtime/predictive-intelligence/InstitutionalResilienceEngine';
import { RecoveryViabilityEngine } from '../src/core/runtime/predictive-intelligence/RecoveryViabilityEngine';
import { StrategicCollapseRiskEngine } from '../src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine';
import { GovernanceRuptureEngine } from '../src/core/runtime/predictive-intelligence/GovernanceRuptureEngine';
import { InstitutionalEarlyWarningEngine } from '../src/core/runtime/predictive-intelligence/InstitutionalEarlyWarningEngine';
import { PredictiveGovernanceEngine } from '../src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine';
import { InstitutionalBehavioralIntelligenceEngine } from '../src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine';

const createBaseReportContext = () => ({
  scores: {
    financial: 85,
    operational: 80,
    governance: 75,
    structural: 90,
    composite: 82
  },
  metrics: {
    ebitda: 1500,
    netIncome: 1200,
    retentionRatio: 0.5
  },
  severity: { level: 'ESTÁVEL' },
  compliance: { confidenceLevel: 'HIGH_CONFIDENCE' },
  cashFlowReport: {
    isAvailable: true,
    operational: { fco: 1400 },
    confidence: 'HIGH_CONFIDENCE'
  },
  capitalGovernanceReport: {
    isAvailable: true,
    preservation: { preservationStatus: 'PRESERVAÇÃO_SAUDÁVEL' },
    behavior: { governanceMaturity: 'MATURA' },
    confidence: 'HIGH_CONFIDENCE'
  },
  businessIdentity: {
    modeloDeNegocio: 'Comércio / Distribuição',
    setor: 'Varejo',
    subsetor: 'Alimentos',
    intensidadeCapital: 'Asset Moderate',
    intensidadeEstoque: 'Alta',
    previsibilidadeReceita: 'Volátil',
    perfilLiquidez: 'Exigência Alta',
    perfilCrescimento: 'Giro de Estoque'
  },
  tenantConfig: undefined as any
});

const createBaseDecision = (domains: any[] = ['Dividend Distribution'], value = 500): ExecutiveDecision => ({
  decisionId: `DEC-TEST-${Math.random().toString(36).substr(2, 9)}`,
  tenantId: 'TENANT-A',
  clientId: 'CLIENT-1',
  domains,
  value,
  motivation: 'Distribuição ordinária de lucros para acionistas.',
  assumptions: ['Suficiência de caixa'],
  expectedOutcomes: ['Manutenção da confiança do investidor'],
  timestamp: new Date().toISOString(),
  approverId: 'USR-CFO',
  approverRole: 'CFO'
});

describe('Institutional Predictive Intelligence & Early Warning Framework', () => {
  beforeEach(() => {
    InstitutionalDecisionLedger.clearMemory();
  });

  describe('1. Short History Rule (Less than 4 decisions)', () => {
    it('Deve retornar INSUFFICIENT_PREDICTIVE_HISTORY se o ledger possuir menos que 4 decisões', async () => {
      const report = createBaseReportContext();
      
      // Seed 2 decisions
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Cost Reduction']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Capital Preservation']));

      const candidate = createBaseDecision(['Dividend Distribution']);
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(candidate, report);

      assert.equal(result.predictiveAssessment?.predictiveSeverity, 'INSUFFICIENT_PREDICTIVE_HISTORY');
      assert.equal(result.predictiveAssessment?.predictiveConfidence, 'LOW');
      // Should NOT apply predictive block
      assert.equal(result.isValid, true); 
    });
  });

  describe('2. Deterioration Momentum', () => {
    it('Deve calcular velocidades e acelerações (derivadas) de scores fiduciários em histórico suficiente', () => {
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -500; // Negative FCO to trigger survivability decline
      // Simulate historical drop in prudence (from baseline 70, down via aggressive decisions)
      const history = [
        createBaseDecision(['Dividend Distribution']), // reduces prudence
        createBaseDecision(['CAPEX']),                 // reduces prudence
        createBaseDecision(['Operational Expansion']), // reduces prudence
        createBaseDecision(['Operational Expansion'])  // further reduction
      ];

      const momentum = DeteriorationMomentumEngine.calculateMomentum(history, report, 'BALANCED');
      
      // Since history is purely aggressive decisions, liquidity (prudence) momentum should be negative
      assert.ok(momentum.liquidityMomentum < 0, `Expected negative liquidity velocity, got: ${momentum.liquidityMomentum}`);
      assert.ok(momentum.survivabilityMomentum < 0, `Expected negative survivability velocity, got: ${momentum.survivabilityMomentum}`);
    });
  });

  describe('3. Resilience & Fragile Recovery Assessment', () => {
    it('Deve acusar Recuperação Frágil se o caixa subir via endividamento sob FCO negativo', () => {
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -800; // Negative FCO!
      report.scores.financial = 35; // Liquidity stress

      // History of financing/debt expansions
      const history = [
        createBaseDecision(['Financing Strategy']),
        createBaseDecision(['Debt Expansion']),
        createBaseDecision(['Financing Strategy']),
        createBaseDecision(['Capital Preservation'])
      ];

      const behavioralResult = InstitutionalBehavioralIntelligenceEngine.evaluateBehavior(
        createBaseDecision(['Capital Preservation']),
        report,
        history,
        'BALANCED'
      );

      const resilience = InstitutionalResilienceEngine.evaluateResilience(history, report, behavioralResult.profile, behavioralResult.fatigue);
      
      assert.equal(resilience.isRecoveryFragile, true);
      assert.ok(resilience.resilienceWarnings.some(w => w.includes('Recuperação Frágil')));
    });

    it('Deve detectar risco de Falso Turnaround sem eficiência operacional real', () => {
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -500; // Negative OCF!

      const history = [
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Debt Expansion']),
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Financing Strategy'])
      ];

      const behavioralResult = InstitutionalBehavioralIntelligenceEngine.evaluateBehavior(
        createBaseDecision(['Cost Reduction']),
        report,
        history,
        'BALANCED'
      );

      const resilience = InstitutionalResilienceEngine.evaluateResilience(history, report, behavioralResult.profile, behavioralResult.fatigue);
      const recovery = RecoveryViabilityEngine.assessRecovery(history, report, behavioralResult.profile, resilience, behavioralResult.fatigue);

      assert.equal(recovery.falseRecoveryRisk, true);
      assert.ok(recovery.sustainabilityDescription.includes('Alerta de Falso Turnaround'));
    });
  });

  describe('4. Governance Rupture & Predictive Blocking (Double-Confirmation)', () => {
    it('Deve barrar decisões de distribuição agressiva sob severidade crítica e evidências de suporte', async () => {
      const report = createBaseReportContext();
      report.scores.composite = 35; // Stress
      report.cashFlowReport.operational.fco = -1500; // Severe cash strain

      // Record 4 historical expansions under stress to build critical failure risk
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Debt Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));

      const candidate = createBaseDecision(['Dividend Distribution'], 5000);
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(candidate, report);

      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'UNSUSTAINABLE');
      assert.ok(result.violations.some(v => v.includes('BLOQUEIO PREDITIVO')));
    });

    it('Não deve barrar decisões não-agressivas (ex: Cost Reduction) mesmo sob severidade preditiva crítica', async () => {
      const report = createBaseReportContext();
      report.scores.composite = 35;
      report.cashFlowReport.operational.fco = -1500;

      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Debt Expansion']));
      await InstitutionalDecisionLedger.recordDecision(createBaseDecision(['Operational Expansion']));

      // Candidate is a Cost Reduction (re-structuring, allowed)
      const candidate = createBaseDecision(['Cost Reduction'], 0);
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(candidate, report);

      // Cost reduction must not be blocked since it is not an aggressive domain
      assert.equal(result.isValid, true);
    });
  });

  describe('5. Executive Scenario Simulation', () => {
    it('Deve simular declínio de sobrevivência no cenário AGGRESSIVE_EXPANSION sob 10 ciclos', () => {
      const report = createBaseReportContext();
      const history = [
        createBaseDecision(['Cost Reduction']),
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Cost Reduction'])
      ];

      const sim = PredictiveGovernanceEngine.simulateScenario(
        history,
        report,
        'BALANCED',
        'AGGRESSIVE_EXPANSION',
        10
      );

      assert.equal(sim.stepsSimulated, 10);
      assert.equal(sim.scenario, 'AGGRESSIVE_EXPANSION');
      // Under aggressive expansion simulation, final composite survivability should be low
      assert.ok(sim.finalSurvivabilityScores.composite < 60, `Composite expected low, got: ${sim.finalSurvivabilityScores.composite}`);
    });
  });
});
