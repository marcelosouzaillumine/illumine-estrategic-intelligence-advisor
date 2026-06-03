import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { CapitalGovernanceSemanticEngine } from '../src/runtime/governance/capital/CapitalGovernanceSemanticEngine';
import { CapitalClassificationEngine } from '../src/runtime/governance/capital/CapitalClassificationEngine';
import { CapitalGovernancePropagationAudit } from '../src/runtime/governance/capital/CapitalGovernancePropagationAudit';

describe('Capital Governance & DLPA Semantic Consistency v1.0.5 Tests', () => {

  const buildBaseContext = (mockHistory: any[], inputData: any = {}): InstitutionalContext => {
    return {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: mockHistory,
          ...inputData
        },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };
  };

  it('1. Validate DRE, DLPA, CGE, and UI Net Income Lineage Integration', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88,
      renderingPayload: {
        netIncome: -68548.88,
        capitalSocial: 121233.21,
        capitalPreservation: 49.18,
        capitalErosion: 50.82,
        governanceScore: 31,
        governanceStatus: 'Governança Crítica'
      }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.netIncome, -68548.88);
    assert.strictEqual(metrics.capitalSocial, 121233.21);
  });

  it('2. Validate Capital Social equals 121,233.21 across CGE', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    const metrics = result.inference?.metrics;
    assert.strictEqual(metrics?.capitalSocial, 121233.21);
  });

  it('3. Validate Preservação Patrimonial equals 49.18%', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    const metrics = result.inference?.metrics;
    assert.strictEqual(metrics?.capitalPreservation, 49.18);
  });

  it('4. Validate Erosão Patrimonial equals 50.82%', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    const metrics = result.inference?.metrics;
    assert.strictEqual(metrics?.capitalErosion, 50.82);
  });

  it('5. Block Governança Fragilizada combination with score >= 80 (Semantic Engine Check)', () => {
    // Score of 80 with high erosion results in 'Governança Estruturada com Risco de Capital'
    const status = CapitalGovernanceSemanticEngine.resolveStatus(80, true);
    assert.strictEqual(status, 'Governança Estruturada com Risco de Capital');

    assert.throws(() => {
      CapitalGovernanceSemanticEngine.validateSemanticConsistency({
        score: 80,
        status: 'Governança Fragilizada',
        endingEquity: 50000,
        capitalSocial: 100000,
        cpiStatus: 'Severe Erosion',
        hasSevereOrHighErosion: true
      });
    }, /SEMANTIC_GOVERNANCE_CONTRADICTION/);
  });

  it('6. Detect CAPITAL_METRIC_LINEAGE_BREAK', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26 },
      lucroLiquido: -68548.88,
      renderingPayload: {
        netIncome: -50000.00, // Lineage break!
        capitalSocial: 121233.21,
        capitalPreservation: 49.18,
        capitalErosion: 50.82,
        governanceScore: 31,
        governanceStatus: 'Governança Crítica'
      }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    const violations = result.violations || [];
    assert.ok(violations.some(v => v.rule === 'CAPITAL_METRIC_LINEAGE_BREAK' || v.rule === 'CAPITAL_DASHBOARD_PROPAGATION_FAILURE'));
  });

  it('7. Detect CAPITAL_DASHBOARD_PROPAGATION_FAILURE', () => {
    const runtime = {
      netIncome: -68548.88,
      capitalSocial: 121233.21,
      capitalPreservation: 49.18,
      capitalErosion: 50.82,
      governanceScore: 49,
      governanceStatus: 'Governança Fragilizada'
    };

    const renderedMismatched = {
      netIncome: -68548.88,
      capitalSocial: 121233.21,
      capitalPreservation: 100.00, // propagation mismatch!
      capitalErosion: 0.00,
      governanceScore: 49,
      governanceStatus: 'Governança Fragilizada'
    };

    const violations = CapitalGovernancePropagationAudit.audit(runtime, renderedMismatched);
    assert.ok(violations.some(v => v.rule === 'CAPITAL_DASHBOARD_PROPAGATION_FAILURE'));
  });

  it('8. Granatum 2022 Dataset Homologation Validation', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.netIncome, -68548.88);
    assert.strictEqual(metrics.capitalSocial, 121233.21);
    assert.strictEqual(metrics.patrimonioLiquido, 59620.26);
    assert.strictEqual(metrics.capitalPreservation, 49.18);
    assert.strictEqual(metrics.capitalErosion, 50.82);
    
    // Prohibit collapse classifications
    assert.notStrictEqual(metrics.cpiStatus, 'Capital Collapse');
    assert.notStrictEqual(metrics.cpiStatus, 'Colapso de Capital');
    assert.notStrictEqual(metrics.cpiStatus, 'Capital Under Collapse');

    // CS check
    const hasCSMissing = (result.violations || []).some(v => v.rule === 'CAPITAL_SOCIAL_MISSING');
    assert.strictEqual(hasCSMissing, false);
  });

});
