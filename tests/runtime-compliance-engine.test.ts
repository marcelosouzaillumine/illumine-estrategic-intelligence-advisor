// tests/runtime-compliance-engine.test.ts
//
// Fiduciary Constitution Test Suite
// Ref: docs/implementation_plan.md

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuntimeComplianceEngine } from '../src/core/runtime/compliance/RuntimeComplianceEngine';

const createValidMockReport = (): any => ({
  scores: {
    financial: 85,
    operational: 80,
    governance: 75,
    structural: 90,
    composite: 82
  },
  metrics: {
    retentionRatio: 0.45,
    revenueGrowth: 0.12 // Variation-based (exempt from ratio limits)
  },
  advisory: {
    executiveSummary: 'Síntese operacional: as margens permanecem estáveis e a estrutura de capital de giro está alinhada.',
    priorityFocus: 'Monitoramento do fluxo de caixa operacional.',
    actionMatrix: ['[ ] Auditoria e conciliação regular.']
  },
  runtimeMetadata: {
    lineage: {
      datasetHash: 'DATA-HASH-123',
      tenantId: 'TENANT-ALPHA',
      importId: 'EXEC-999'
    }
  },
  compliance: {
    confidenceLevel: 'HIGH_CONFIDENCE'
  },
  cashFlowReport: { isAvailable: true, confidence: 'HIGH_CONFIDENCE' },
  capitalGovernanceReport: { isAvailable: true, confidence: 'HIGH_CONFIDENCE' },
  institutionalContext: {
    confidence: { strategicConfidence: 'HIGH_CONFIDENCE' }
  },
  institutionalEvidence: {
    validationStatus: 'VALIDATED',
    evidenceTrail: []
  }
});

describe('Institutional Fiduciary Runtime Constitution - Compliance Engine', () => {

  describe('1. Denominator Materiality Validation', () => {
    const engine = RuntimeComplianceEngine.getInstance();

    it('Deve barrar divisor zero', () => {
      const res = engine.validateDenominator(100, 0);
      assert.deepEqual(res, { labelKey: 'runtime.compliance.insufficient_base_for_deterministic_calculation', severity: 'critical' });
    });

    it('Deve barrar divisor abaixo do threshold de materialidade', () => {
      const res = engine.validateDenominator(100, 0.005, 0.01);
      assert.deepEqual(res, { labelKey: 'runtime.compliance.insufficient_base_for_deterministic_calculation', severity: 'critical' });
    });

    it('Deve permitir divisores válidos', () => {
      const res = engine.validateDenominator(100, 5, 0.01);
      assert.equal(res, 20);
    });
  });

  describe('2. Explosive Ratio Thresholds by Metric Class', () => {
    it('Deve bloquear ratios estruturais explosivos (> 1000%)', () => {
      const report = createValidMockReport();
      report.metrics.retentionRatio = 12.5; // 1250% (Structural ratio)

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /explosive_metric/);
    });

    it('Deve aceitar variação percentual explosiva sem lançar erro de ratio', () => {
      const report = createValidMockReport();
      report.metrics.revenueGrowth = 15.0; // 1500% growth (Variation metric - allowed)

      const result = RuntimeComplianceEngine.validate(report, 'render');
      assert.equal(result.isValid, true);
    });
  });

  describe('3. Score Anomaly Protection', () => {
    it('Deve bloquear scores NaN', () => {
      const report = createValidMockReport();
      report.scores.financial = NaN;

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /nan_error/);
    });

    it('Deve bloquear scores fora da faixa 0-100', () => {
      const report = createValidMockReport();
      report.scores.composite = 105;

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /invalid_score/);
    });
  });

  describe('4. Semantic Governance & Tone Checks', () => {
    it('Deve barrar termos proibidos em relatórios formais', () => {
      const report = createValidMockReport();
      report.advisory.pureViewModel.executiveSummary = 'Identificamos fraude na folha e colapso definitivo na tesouraria.';

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /forbidden_term/);
    });

    it('Deve barrar termo "predatório" se não houver evidência distributiva', () => {
      const report = createValidMockReport();
      report.advisory.pureViewModel.executiveSummary = 'Observamos uma extração predatória de caixa.';
      // hasDistributiveEvidence defaults to false

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /destructive_term_without_evidence/);
    });

    it('Deve emitir warning em caso de linguagem dramática/não-sóbria', () => {
      const report = createValidMockReport();
      report.advisory.pureViewModel.executiveSummary = 'A situação da liquidez imediata está catastrófica e causou pânico.';

      const result = RuntimeComplianceEngine.validate(report, 'render');
      assert.ok(result.warnings.some(w => w.args?.term === 'catastrófica'));
      assert.ok(result.warnings.some(w => w.args?.term === 'pânico'));
    });
  });

  describe('5. Domain Isolation & Propagation Integrity', () => {
    it('Deve barrar governança DESTRUTIVA se não houver evidência de distribuição', () => {
      const report = createValidMockReport();
      (report as any).capitalGovernanceReport = {
        isAvailable: true,
        behavior: {
          governanceMaturity: 'DESTRUTIVA'
        },
        distribution: {
          hasDistributiveEvidence: false
        }
      };

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /fiduciary_violation_destructive_without_evidence/);
    });

    it('Deve barrar inflação/corrupção de confiança se o composto exceder as partes', () => {
      const report = createValidMockReport();
      report.compliance.confidenceLevel = 'HIGH_CONFIDENCE';
      report.cashFlowReport.confidence = 'LOW_CONFIDENCE'; // Sub-component is low

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /confidence_corruption/);
    });
  });

  describe('6. Enforcement Modes', () => {
    it('Modo RENDER: Deve permitir renderização com flags degradadas e banners na UI', () => {
      const report = createValidMockReport();
      report.scores.financial = NaN; // Math error

      const result = RuntimeComplianceEngine.validate(report, 'render');
      assert.equal(result.isValid, false);
      assert.equal(result.grade, 'F');
      assert.ok(report.compliance.auditFlags.includes('NON_COMPLIANT_RENDER_DEGRADED'));
    });

    it('Modo EXPORT: Deve disparar exceção rígida', () => {
      const report = createValidMockReport();
      report.scores.financial = NaN;

      assert.throws(() => {
        RuntimeComplianceEngine.validate(report, 'export');
      }, /BLOQUEIO CONSTITUCIONAL/);
    });

    it('Modo ADVISORY: Deve aplicar estado Fail-Closed silenciosamente', () => {
      const report = createValidMockReport();
      report.scores.financial = NaN;

      const result = RuntimeComplianceEngine.validate(report, 'advisory');
      assert.equal(result.isValid, false);
      assert.equal(report.scores.financial, 0);
      assert.ok(report.advisory.pureViewModel.executiveSummary.includes('Informação insuficiente para inferência institucional'));
    });
  });
});
