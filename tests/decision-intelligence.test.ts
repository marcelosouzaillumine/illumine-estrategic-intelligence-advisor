// tests/decision-intelligence.test.ts
//
// Decision Intelligence Framework Test Suite
// Ref: docs/implementation_plan.md

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDecisionIntelligenceEngine } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine';
import { InstitutionalDecisionLedger } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionLedger';
import { ExecutiveDecision } from '../src/core/runtime/decision-intelligence/decision-types';
import { BoardResolutionEngine } from '../src/capabilities/financial/runtime/board-decision/BoardResolutionEngine';
import { InstitutionalScenarioResult } from '../src/core/runtime/scenario-intelligence/scenario-types';

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
  }
});

const createBaseDecision = (domains: any[] = ['Dividend Distribution']): ExecutiveDecision => ({
  decisionId: `DEC-TEST-${Date.now()}`,
  tenantId: 'TENANT-A',
  clientId: 'CLIENT-1',
  domains,
  value: 500,
  motivation: 'Distribuição anual ordinária de resultados corporativos.',
  assumptions: ['Suficiência de lucros acumulados'],
  expectedOutcomes: ['Satisfação de acionistas'],
  timestamp: new Date().toISOString(),
  approverId: 'USR-CFO',
  approverRole: 'CFO'
});

describe('Institutional Decision Governance Framework', () => {

  beforeEach(() => {
    InstitutionalDecisionLedger.clearMemory();
  });

  describe('1. Forbidden Decisions & Hard-Blocking', () => {
    it('Deve bloquear distribuição de dividendos sob prejuízo líquido', async () => {
      const decision = createBaseDecision(['Dividend Distribution']);
      const report = createBaseReportContext();
      report.metrics.netIncome = -500; // Net loss!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'CONSTITUTIONAL_VIOLATION');
      assert.ok(result.violations.some(v => v.includes('Dividendos rejeitada devido a erosão patrimonial ativa ou ausência de lucro líquido')));
    });

    it('Deve bloquear distribuição de dividendos sob erosão patrimonial ativa', async () => {
      const decision = createBaseDecision(['Dividend Distribution']);
      const report = createBaseReportContext();
      report.capitalGovernanceReport.preservation.preservationStatus = 'FRAGILIDADE_PATRIMONIAL'; // Erosion!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'CONSTITUTIONAL_VIOLATION');
      assert.ok(result.violations.some(v => v.includes('Dividendos rejeitada devido a erosão patrimonial ativa')));
    });

    it('Deve bloquear expansão operacional sob estresse crítico de liquidez', async () => {
      const decision = createBaseDecision(['Operational Expansion']);
      const report = createBaseReportContext();
      report.scores.financial = 30; // Critical!
      report.cashFlowReport.operational.fco = -1000; // Negative FCO!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'UNSUSTAINABLE');
      assert.ok(result.violations.some(v => v.includes('Expansão operacional ou de pessoal rejeitada')));
    });

    it('Deve bloquear CAPEX sob fluxo de caixa operacional negativo', async () => {
      const decision = createBaseDecision(['CAPEX']);
      decision.value = 5000; // Make it material to prevent auto-bypass
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -200; // Negative FCO!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'UNSUSTAINABLE');
      assert.ok(result.violations.some(v => v.includes('CAPEX rejeitado')));
    });
  });

  describe('2. Survivability Score Calculations', () => {
    it('Deve calcular scores altos para cenários saudáveis', async () => {
      const decision = createBaseDecision(['Cost Reduction']);
      const report = createBaseReportContext();
      report.scores.financial = 98;
      report.scores.operational = 98;
      report.scores.governance = 98;
      report.scores.structural = 98;
      report.scores.composite = 98;

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, true);
      assert.ok(result.survivabilityScores.composite >= 75);
      assert.equal(result.certification.overallGrade, 'A');
    });

    it('Deve degradar score de liquidez sob OCF negativo', async () => {
      const decision = createBaseDecision(['Cost Reduction']);
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -500; // Cash burn

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.ok(result.survivabilityScores.liquidity < report.scores.financial);
    });

    it('Deve degradar score de capital sob fragilidade patrimonial', async () => {
      const decision = createBaseDecision(['Cost Reduction']);
      const report = createBaseReportContext();
      report.capitalGovernanceReport.preservation.preservationStatus = 'FRAGILIDADE_PATRIMONIAL';

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.ok(result.survivabilityScores.capitalPreservation < 50);
    });
  });

  describe('3. Causality & Second-order propagation', () => {
    it('Deve conter propagação de riscos fiduciários para CAPEX', async () => {
      const decision = createBaseDecision(['CAPEX']);
      const report = createBaseReportContext();

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.ok(result.propagationPath.some(p => p.includes('CAPEX → Liquidez de Curto Prazo')));
    });

    it('Deve conter propagação de custos adicionais para Expansão Operacional', async () => {
      const decision = createBaseDecision(['Operational Expansion']);
      const report = createBaseReportContext();

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.ok(result.propagationPath.some(p => p.includes('Eficiência Operacional → Caixa Operacional')));
    });
  });

  describe('4. Governance Trajectory Recurrence & Memory Ledger', () => {
    it('Deve registrar decisões válidas no ledger de memória', async () => {
      const decision = createBaseDecision(['Cost Reduction']);
      const report = createBaseReportContext();

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, true);

      const history = await InstitutionalDecisionLedger.getDecisions('TENANT-A', 'CLIENT-1');
      assert.equal(history.length, 1);
      assert.equal(history[0].domains[0], 'Cost Reduction');
    });

    it('Deve detectar trajetória de deterioração quando decisões de distribuição de dividendos se repetirem', async () => {
      const report = createBaseReportContext();

      // Record first dividend decision
      const decision1 = createBaseDecision(['Dividend Distribution']);
      await InstitutionalDecisionLedger.recordDecision(decision1);

      // Record second dividend decision
      const decision2 = createBaseDecision(['Dividend Distribution']);
      await InstitutionalDecisionLedger.recordDecision(decision2);

      // Evaluate a third dividend decision, which should check ledger history
      const decision3 = createBaseDecision(['Dividend Distribution']);
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision3, report);

      assert.equal(result.warnings.length > 0, true);
      assert.ok(result.warnings.some(w => w.includes('Monitoramento recomendado') || w.includes('Aviso de Sobrevivência')));
    });
  });

  describe('5. Fail-Closed Enforcement', () => {
    it('Deve degradar narrativa executiva se a sobrevivência for crítica', async () => {
      const decision = createBaseDecision(['Dividend Distribution']);
      const report = createBaseReportContext();
      report.scores.financial = 10;
      report.scores.composite = 20;
      report.cashFlowReport.operational.fco = -10000; // Massive burn

      // This makes overall survivability score < 50, triggering fail closed
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.certification.overallGrade, 'F');
    });
  });

  describe('6. Board Resolution Engine Integration', () => {
    it('Deve rejeitar formalização de resolução se violar conformidade fiduciária', () => {
      // Setup a scenario representing an invalid operational expansion under critical liquidity
      const criticalScenario: InstitutionalScenarioResult = {
        id: 'SCEN-DIVIDEND-TEST',
        inputs: [],
        validation: { status: 'VALID' },
        propagationProfile: {
          nodes: [],
          edges: [],
          structuralIntegrityScore: 20,
          systemicSeverity: 'CRÍTICA'
        },
        explainability: {
          baselineHash: 'B-HASH-1',
          simulationHash: 'S-HASH-1',
          lineageHash: 'L-HASH-CRITICAL-999',
          constraintTriggers: [],
          propagationRationale: []
        }
      };

      // Formalizing this resolution should fail because the BoardResolutionEngine evaluates
      // DecisionComplianceEngine.validate which will fail due to negative default netIncome in validation check
      // or other checks.
      assert.throws(() => {
        BoardResolutionEngine.formalizeResolution(
          'TENANT-A',
          'CLIENT-1',
          criticalScenario,
          'Racional longo suficiente para formalizar resolução do Board.',
          'USR-CFO',
          'CFO'
        );
      }, /FIDUCIARY_VIOLATION: Resolução do Board rejeitada pelo DecisionComplianceEngine/);
    });
  });
});
