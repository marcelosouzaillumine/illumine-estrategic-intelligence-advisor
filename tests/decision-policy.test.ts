// tests/decision-policy.test.ts
//
// Decision Policy & Institutional Materiality Framework Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDecisionIntelligenceEngine } from '../src/capabilities/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine';
import { DecisionComplianceEngine } from '../src/capabilities/runtime/decision-intelligence/DecisionComplianceEngine';
import { InstitutionalSurvivabilityEngine } from '../src/capabilities/runtime/decision-intelligence/InstitutionalSurvivabilityEngine';
import { DecisionPolicyEngine } from '../src/core/runtime/decision-policy/DecisionPolicyEngine';
import { InstitutionalMaterialityEngine } from '../src/core/runtime/decision-policy/InstitutionalMaterialityEngine';
import { ExecutiveDecision } from '../src/capabilities/runtime/decision-intelligence/decision-types';

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
    netRevenue: 200000,
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

const createBaseDecision = (domains: any[] = ['Dividend Distribution'], value = 5000): ExecutiveDecision => ({
  decisionId: `DEC-TEST-${Date.now()}`,
  tenantId: 'TENANT-A',
  clientId: 'CLIENT-1',
  domains,
  value,
  motivation: 'Ordinário para fins de teste fiduciário.',
  assumptions: ['Suficiência de caixa'],
  expectedOutcomes: ['Prosseguimento das operações'],
  timestamp: new Date().toISOString(),
  approverId: 'USR-CFO',
  approverRole: 'CFO'
});

describe('Decision Policy & Institutional Materiality Framework', () => {

  describe('1. Dynamic Policy Routing & Precedence Rules', () => {
    it('Deve inferir o perfil a partir do setor (Hospital -> HOSPITAL)', () => {
      const decision = createBaseDecision();
      const report = createBaseReportContext();
      report.businessIdentity.setor = 'Hospital de Grande Porte';

      const context = DecisionPolicyEngine.applyPolicy(decision, report);
      assert.equal(context.activeProfile, 'HOSPITAL');
      assert.equal(context.sectorGovernance.isStrictLiquidityRequired, true);
    });

    it('Deve inferir o perfil a partir do setor (ONG -> NONPROFIT)', () => {
      const decision = createBaseDecision();
      const report = createBaseReportContext();
      report.businessIdentity.setor = 'ONG de Amparo Social';

      const context = DecisionPolicyEngine.applyPolicy(decision, report);
      assert.equal(context.activeProfile, 'NONPROFIT');
      assert.equal(context.sectorGovernance.allowDistribution, false);
    });

    it('Deve dar precedência para explicit tenant config profile sobre a inferência', () => {
      const decision = createBaseDecision();
      const report = createBaseReportContext();
      report.businessIdentity.setor = 'Hospital'; // Sugere HOSPITAL
      report.tenantConfig = { policyProfile: 'CONSERVATIVE' }; // Sobrescreve com CONSERVATIVE

      const context = DecisionPolicyEngine.applyPolicy(decision, report);
      assert.equal(context.activeProfile, 'CONSERVATIVE');
    });

    it('Deve dar fallback para BALANCED se nenhuma inferência ou config explicit existir', () => {
      const decision = createBaseDecision();
      const report = createBaseReportContext();
      report.businessIdentity.setor = 'Indefinido';
      
      const context = DecisionPolicyEngine.applyPolicy(decision, report);
      assert.equal(context.activeProfile, 'BALANCED');
    });
  });

  describe('2. Materiality Base Calculations', () => {
    it('Deve calcular a base de materialidade usando o maior entre 1% OCF, 1% Lucro Líquido, 0.5% Receita Líquida e R$ 1.000', () => {
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = 80000; // 1% = 800
      report.metrics.netIncome = 50000;             // 1% = 500
      report.metrics.netRevenue = 300000;           // 0.5% = 1500

      const base = InstitutionalMaterialityEngine.calculateMaterialityBase(report);
      assert.equal(base, 1500); // 0.5% da Receita Líquida é o maior (1500)
    });

    it('Deve respeitar o mínimo absoluto de R$ 1.000 se todos os indicadores forem baixos', () => {
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = 2000; // 1% = 20
      report.metrics.netIncome = 1000;             // 1% = 10
      report.metrics.netRevenue = 10000;           // 0.5% = 50

      const base = InstitutionalMaterialityEngine.calculateMaterialityBase(report);
      assert.equal(base, 1000);
    });
  });

  describe('3. Context-Aware Score Thresholds & Tolerances', () => {
    it('TURNAROUND deve rebaixar os limites mínimos (liquidez min = 20, composite min = 40)', () => {
      const tolerances = DecisionPolicyEngine.applyPolicy(
        createBaseDecision(),
        { ...createBaseReportContext(), tenantConfig: { policyProfile: 'TURNAROUND' } }
      ).survivabilityTolerance;

      assert.equal(tolerances.minLiquidityScore, 20);
      assert.equal(tolerances.minCompositeScore, 40);
    });

    it('NONPROFIT deve elevar os limites mínimos (liquidez min = 50, composite min = 60)', () => {
      const tolerances = DecisionPolicyEngine.applyPolicy(
        createBaseDecision(),
        { ...createBaseReportContext(), tenantConfig: { policyProfile: 'NONPROFIT' } }
      ).survivabilityTolerance;

      assert.equal(tolerances.minLiquidityScore, 50);
      assert.equal(tolerances.minCompositeScore, 60);
    });
  });

  describe('4. Materiality Bypassing & Controlled Severity Flexibilities', () => {
    it('Deve mitigar (converter para aviso) restrições de CAPEX se o valor da decisão for imaterial', async () => {
      // CAPEX de R$ 500 em empresa com faturamento de R$ 200.000 (Base de materialidade = 1000)
      const decision = createBaseDecision(['CAPEX'], 500); // Imaterial!
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -100; // Gera caixa negativo, bloqueando CAPEX normalmente

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, true); // Bypassed/Mitigado!
      assert.ok(result.warnings.some(w => w.includes('Aviso de Sobrevivência (Bloqueio Mitigado)')));
    });

    it('Não deve mitigar restrições de CAPEX se a decisão for material', async () => {
      const decision = createBaseDecision(['CAPEX'], 8000); // Material!
      const report = createBaseReportContext();
      report.cashFlowReport.operational.fco = -100;

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false); // Bloqueado fiduciariamente!
      assert.equal(result.severity, 'UNSUSTAINABLE');
    });
  });

  describe('5. Absolute Constitutional Safeguards (Non-bypassable Rules)', () => {
    it('Deve manter bloqueio rígido de dividendos sob prejuízo líquido mesmo sendo imaterial', async () => {
      const decision = createBaseDecision(['Dividend Distribution'], 200); // R$ 200 é imaterial
      const report = createBaseReportContext();
      report.metrics.netIncome = -100; // Prejuízo líquido!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'CONSTITUTIONAL_VIOLATION'); // Non-bypassable!
    });

    it('Deve bloquear distribuição de dividendos em ONGs/Nonprofits', async () => {
      const decision = createBaseDecision(['Dividend Distribution'], 5000);
      const report = createBaseReportContext();
      report.businessIdentity.setor = 'Organização Social sem fins lucrativos'; // Nonprofit!

      const result = await InstitutionalDecisionIntelligenceEngine.evaluateDecision(decision, report);
      assert.equal(result.isValid, false);
      assert.equal(result.severity, 'CONSTITUTIONAL_VIOLATION');
      assert.ok(result.violations.some(v => v.includes('sem fins lucrativos')));
    });
  });
});
