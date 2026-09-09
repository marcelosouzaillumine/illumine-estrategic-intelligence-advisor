// tests/behavioral-intelligence.test.ts
//
// Institutional Behavioral Intelligence & Governance Drift Framework Test Suite

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDecisionIntelligenceEngine } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine';
import { InstitutionalDecisionLedger } from '../src/core/runtime/decision-intelligence/InstitutionalDecisionLedger';
import { ExecutiveDecision } from '../src/core/runtime/decision-intelligence/decision-types';
import { InstitutionalBehaviorProfileEngine } from '../src/core/runtime/behavioral-intelligence/InstitutionalBehaviorProfileEngine';
import { GovernanceDriftEngine } from '../src/core/runtime/behavioral-intelligence/GovernanceDriftEngine';
import { GovernanceFatigueEngine } from '../src/core/runtime/behavioral-intelligence/GovernanceFatigueEngine';
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

describe('Institutional Behavioral Governance & Governance Drift Framework', () => {
  beforeEach(() => {
    InstitutionalDecisionLedger.clearMemory();
  });

  describe('1. Policy-Aware EMA Smoothing Factor (Alpha)', () => {
    it('Deve aplicar alpha = 0.10 para o perfil CONSERVATIVE', () => {
      const alpha = InstitutionalBehaviorProfileEngine.getAlpha('CONSERVATIVE');
      assert.equal(alpha, 0.10);
    });

    it('Deve aplicar alpha = 0.20 para o perfil BALANCED', () => {
      const alpha = InstitutionalBehaviorProfileEngine.getAlpha('BALANCED');
      assert.equal(alpha, 0.20);
    });

    it('Deve aplicar alpha = 0.30 para os perfis AGGRESSIVE_GROWTH e HYPER_GROWTH', () => {
      assert.equal(InstitutionalBehaviorProfileEngine.getAlpha('AGGRESSIVE_GROWTH'), 0.30);
      assert.equal(InstitutionalBehaviorProfileEngine.getAlpha('HYPER_GROWTH'), 0.30);
    });

    it('Deve aplicar alpha = 0.35 para o perfil TURNAROUND', () => {
      const alpha = InstitutionalBehaviorProfileEngine.getAlpha('TURNAROUND');
      assert.equal(alpha, 0.35);
    });

    it('Deve suavizar a transição do perfil cumulativo gradualmente com base no alpha do perfil ativo', () => {
      const report = createBaseReportContext();
      
      // Decisão agressiva (Dividendos)
      const decision = createBaseDecision(['Dividend Distribution']);
      
      // Sob perfil BALANCED (alpha = 0.20)
      // Baseline agressividade = 30. Target agressividade = 85.
      // Esperado: 0.20 * 85 + 0.80 * 30 = 17 + 24 = 41
      const profileBalanced = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(
        [decision],
        report,
        'BALANCED'
      );
      assert.equal(profileBalanced.aggressiveness, 41);

      // Sob perfil CONSERVATIVE (alpha = 0.10)
      // Esperado: 0.10 * 85 + 0.90 * 30 = 8.5 + 27 = 35.5 (rounds to 36)
      const profileConservative = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(
        [decision],
        report,
        'CONSERVATIVE'
      );
      assert.equal(profileConservative.aggressiveness, 36);
    });
  });

  describe('2. Historical Depth & Governance Drift Categories', () => {
    it('Deve manter estabilidade sob histórico menor que 3 decisões', () => {
      const decision = createBaseDecision(['Dividend Distribution']);
      const report = createBaseReportContext();
      report.metrics.netIncome = -500; // Under net loss

      const drift = GovernanceDriftEngine.detectDrift(decision, [], report);
      assert.equal(drift.overallSeverity, 'STABLE');
    });

    it('Um único desvio severo não deve redefinir a identidade permanentemente (CRITICAL_DRIFT, não CONSTITUTIONAL_DRIFT)', () => {
      const history = [
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Capital Preservation'])
      ];
      
      const decision = createBaseDecision(['Dividend Distribution']);
      const report = createBaseReportContext();
      report.metrics.netIncome = -500; // Net loss!

      const drift = GovernanceDriftEngine.detectDrift(decision, history, report);
      // single deviation is critical but not constitutional drift
      assert.equal(drift.overallSeverity, 'CRITICAL_DRIFT');
      assert.equal(drift.categories.capitalPreservationDrift, 'CRITICAL_DRIFT');
    });

    it('Recorrência material de violações deve elevar a severidade para CONSTITUTIONAL_DRIFT', () => {
      const report = createBaseReportContext();
      report.metrics.netIncome = -500; // Net loss!

      const history = [
        createBaseDecision(['Dividend Distribution']), // 1st violation
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Capital Preservation']),
        createBaseDecision(['Capital Preservation'])
      ];

      const decision = createBaseDecision(['Dividend Distribution']); // 2nd violation

      const drift = GovernanceDriftEngine.detectDrift(decision, history, report);
      assert.equal(drift.overallSeverity, 'CONSTITUTIONAL_DRIFT');
      assert.equal(drift.categories.capitalPreservationDrift, 'CONSTITUTIONAL_DRIFT');
    });
  });

  describe('3. Governance Fatigue Categorization', () => {
    it('Deve acumular fadiga de sobrevivência sob múltiplos cortes de custo consecutivos', () => {
      const report = createBaseReportContext();
      const history = [
        createBaseDecision(['Cost Reduction']),
        createBaseDecision(['Cost Reduction']),
        createBaseDecision(['Cost Reduction'])
      ];

      const fatigue = GovernanceFatigueEngine.calculateFatigue(history, report);
      assert.ok(fatigue.survivabilityFatigue > 10, `Fadiga esperada > 10, obteve: ${fatigue.survivabilityFatigue}`);
      assert.equal(fatigue.survivabilityFatigue, 10 + (3 * 15)); // 55
    });

    it('Deve distinguir entre Operational, Governance, Strategic e Survivability Fatigue', () => {
      const report = createBaseReportContext();
      const history = [
        createBaseDecision(['Cost Reduction']),
        createBaseDecision(['Operational Expansion']), // strategic shift
        createBaseDecision(['Cost Reduction'])          // another shift
      ];

      const fatigue = GovernanceFatigueEngine.calculateFatigue(history, report);
      assert.ok(fatigue.operationalFatigue !== undefined);
      assert.ok(fatigue.governanceFatigue !== undefined);
      assert.ok(fatigue.strategicFatigue > 10); // Shifts detected
      assert.ok(fatigue.survivabilityFatigue !== undefined);
      assert.ok(fatigue.compositeFatigue !== undefined);
    });
  });

  describe('4. Behavioral Hard Blocks (CONSTITUTIONAL_DRIFT)', () => {
    it('Deve barrar qualquer decisão de distribuição quando CONSTITUTIONAL_DRIFT for detectado', async () => {
      const report = createBaseReportContext();
      report.metrics.netIncome = -500; // Net loss!

      // 1. First record some historical violations to build drift
      const firstDecision = createBaseDecision(['Dividend Distribution']);
      await InstitutionalDecisionLedger.recordDecision(firstDecision);

      const secondDecision = createBaseDecision(['Capital Preservation']);
      await InstitutionalDecisionLedger.recordDecision(secondDecision);

      const thirdDecision = createBaseDecision(['Capital Preservation']);
      await InstitutionalDecisionLedger.recordDecision(thirdDecision);

      // Now evaluate the next dividend distribution under net loss
      const targetDecision = createBaseDecision(['Dividend Distribution']);
      
      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(targetDecision, report);
      
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'UNSUSTAINABLE');
      assert.ok(result.violations.some(v => v.includes('BLOQUEIO COMPORTAMENTAL') || v.includes('Ruptura fiduciária longitudinal')));
    });
  });
});
