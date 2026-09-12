import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/capabilities/financial/runtime/capital-governance/capital-governance-adapter';

// Local expect wrapper matching Jest/Vitest style to comply with user's specific assertion requirements
const expect = (actual: any) => ({
  toBeGreaterThanOrEqual: (expected: number) => {
    assert.ok(actual >= expected, `Expected >= ${expected}, got ${actual}`);
  },
  toBeLessThanOrEqual: (expected: number) => {
    assert.ok(actual <= expected, `Expected <= ${expected}, got ${actual}`);
  },
  toBe: (expected: any) => {
    assert.strictEqual(actual, expected);
  },
  toEqual: (expected: any) => {
    assert.deepStrictEqual(actual, expected);
  },
  toContain: (expected: string) => {
    assert.ok(typeof actual === 'string' && actual.includes(expected), `Expected "${actual}" to contain "${expected}"`);
  }
});

describe('DLPA Temporal Recoverability Finalization Framework (DTRFF) v1.0', () => {
  // Common test fixture for Granatum 2022 with a contaminated future year (2023)
  const dbDataDLPA: any[] = [{ year: 2022, conta: 'dummy', val: 0 }];
  const lucroLiquido = -68548.88;
  const retainedEarnings = -68548.88;
  const dividendos = 0;
  const plInicio = 128169.14;
  const plFim = 59620.26;
  const aumentoCapital = 121233.21;

  const allHistoryData: any[] = [
    {
      year: 2022,
      docType: 'bp',
      conta: 'capital social',
      val: 121233.21
    },
    // Future positive cycle which must be ignored by the 2022 analysis
    {
      year: 2023,
      docType: 'dre',
      conta: 'lucro liquido',
      val: 150000.00
    }
  ];

  const financialRuntimeContext = {
    lifecycle: {
      analysisYear: 2022,
      foundationYear: 2020
    },
    lifecycleProfile: {
      lifecycleStage: 'INITIAL_CAPITALIZATION',
      governanceStatus: { semanticLabel: 'Governança em Estruturação' },
      capitalStatus: { semanticLabel: 'Capitalização em Consolidação' },
      allowedLabels: ['Governança em Estruturação', 'Capitalização em Consolidação'],
      forbiddenLabels: []
    },
    contextualConfidence: 'HIGH' as const,
    interpretationWarnings: [] as string[],
    requiredDisclosures: [] as string[],
    auditTrail: [] as string[]
  };

  const result = CapitalGovernanceAdapter.process(
    dbDataDLPA,
    lucroLiquido,
    retainedEarnings,
    dividendos,
    plInicio,
    plFim,
    aumentoCapital,
    financialRuntimeContext as any,
    allHistoryData
  );

  const exec = result.executiveLayer;

  test('1. Zero future contamination: only years <= analysisYear are used', () => {
    assert.ok(exec, 'Executive layer must be defined');
    const horizon = exec.patrimonialRecoveryHorizon;
    // Check that the blockedYears contains the future year (2023)
    const blockedYears = horizon.sourceMetrics?.blockedYears || [];
    assert.ok(blockedYears.includes(2023), 'Future year 2023 must be blocked');
  });

  test('2. Granatum 2022 has recovery horizon not estimable', () => {
    const horizon = exec!.patrimonialRecoveryHorizon;
    expect(horizon.available).toBe(false);
    expect(horizon.classification).toBe('Não Estimável');
    expect(horizon.formatted).toBe('Não Estimável');
  });

  test('3. Granatum 2022 has capital recoverability classification not estimable', () => {
    const rec = exec!.capitalRecoverability;
    expect(rec.available).toBe(false);
    expect(rec.classification).toBe('Não Estimável');
  });

  test('4. Granatum 2022 has CPS horizon score component clamped to 25', () => {
    const cps = exec!.capitalPreservationScore;
    expect(cps.components.horizonScore).toBe(25);
  });

  test('5. Granatum 2022 CPS score is recalculated inside the prudential range [34, 38]', () => {
    const cps = exec!.capitalPreservationScore;
    expect(cps.pureViewModel.score).toBeGreaterThanOrEqual(34);
    expect(cps.pureViewModel.score).toBeLessThanOrEqual(38);
  });

  test('6. No display of "0,0 anos" under negative historical profits', () => {
    const horizon = exec!.patrimonialRecoveryHorizon;
    assert.notStrictEqual(horizon.formatted, '0,0 anos');
    assert.notStrictEqual(horizon.classification, '0,0 anos');
  });

  test('7. No display of "Alta Recuperabilidade" under negative historical profits', () => {
    const rec = exec!.capitalRecoverability;
    assert.notStrictEqual(rec.classification, 'Alta');
  });

  test('8. Governance radar status resolves strictly to "Capital Fragilizado" for Granatum 2022 (49.2%)', () => {
    // 59620.26 / 121233.21 = 0.49178 (49.2%)
    expect(result.resolvedCapitalStatus).toBe('Capital Fragilizado');
  });

  test('9. Recovery thesis is updated with full retention narrative', () => {
    const thesis = exec!.governanceInterpretation.recoveryThesis;
    expect(thesis).toContain('retenção integral dos lucros futuros até a absorção completa das perdas acumuladas');
  });

  test('10. Narrative consistency audit passes successfully without violations', () => {
    const audit = result.consistencyAudit;
    assert.ok(audit, 'Consistency audit object must be present');
    expect(audit.valid).toBe(true);
    expect(audit.violations.length).toBe(0);
  });
});
