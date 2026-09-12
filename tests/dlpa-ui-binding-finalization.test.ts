import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/capabilities/financial/runtime/capital-governance/capital-governance-adapter';
import { DLPACanonicalBindingAudit } from '../src/capabilities/runtime/governance/dlpa/DLPACanonicalBindingAudit';
import { DLPACanonicalScoreResolver } from '../src/capabilities/runtime/governance/dlpa/DLPACanonicalScoreResolver';
import { DLPARecoveryHorizonResolver } from '../src/capabilities/runtime/governance/dlpa/DLPARecoveryHorizonResolver';
import { DLPALegacyPayloadAudit } from '../src/capabilities/runtime/governance/dlpa/DLPALegacyPayloadAudit';
import { DLPAUIConsistencyAudit } from '../src/capabilities/runtime/governance/dlpa/DLPAUIConsistencyAudit';
import { DLPALegacyFieldScanner } from '../src/capabilities/runtime/governance/dlpa/DLPALegacyFieldScanner';
import { DLPACanonicalPayloadEnforcer } from '../src/capabilities/runtime/governance/dlpa/DLPACanonicalPayloadEnforcer';
import { DLPAUIHardFailAudit } from '../src/capabilities/runtime/governance/dlpa/DLPAUIHardFailAudit';

// Local expect helper to support Jest/Vitest style syntax
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
  },
  not: {
    toContain: (expected: string) => {
      assert.ok(typeof actual === 'string' && !actual.includes(expected), `Expected "${actual}" NOT to contain "${expected}"`);
    }
  }
});

describe('DLPA UI Binding Finalization Framework (DUBFF) v1.0', () => {
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

  test('1. Horizonte indisponível não renderiza "0,0 anos"', () => {
    assert.ok(exec, 'Executive layer must be defined');
    const resolvedHorizon = DLPARecoveryHorizonResolver.resolve(
      exec.patrimonialRecoveryHorizon,
      exec.capitalRecoverability
    );
    expect(resolvedHorizon.formatted).not.toContain('0,0 anos');
    expect(resolvedHorizon.formatted).toBe('Sem histórico recorrente elegível');
  });

  test('2. Horizonte indisponível não renderiza classificação "Alta"', () => {
    const resolvedHorizon = DLPARecoveryHorizonResolver.resolve(
      exec.patrimonialRecoveryHorizon,
      exec.capitalRecoverability
    );
    expect(resolvedHorizon.classification).not.toContain('Alta');
    expect(resolvedHorizon.classification).toBe('Não Estimável');
  });

  test('3. CPS utiliza horizonScore = 25 quando o horizonte é Não Estimável', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    expect(exec.capitalPreservationScore.components.horizonScore).toBe(25);
  });

  test('4. A fórmula exibida em texto reflete o horizonScore = 25', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    expect(resolvedCps.rationale).toContain('Horizonte (25 pts × 15%)');
  });

  test('5. Granatum 2022 resulta em CPS entre 34 e 38', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    expect(resolvedCps.score).toBeGreaterThanOrEqual(34);
    expect(resolvedCps.score).toBeLessThanOrEqual(38);
  });

  test('6. Radar retorna "Capital Fragilizado" para Granatum 2022 (49.2%)', () => {
    expect(result.resolvedCapitalStatus).toBe('Capital Fragilizado');
  });

  test('7. Recovery Thesis inclui diretriz de retenção integral de lucros', () => {
    const thesis = exec.governanceInterpretation.recoveryThesis;
    expect(thesis).toContain('retenção integral dos lucros futuros até a absorção completa das perdas acumuladas');
  });

  test('8. Ausência de contaminação por exercícios futuros', () => {
    const blockedYears = exec.patrimonialRecoveryHorizon.sourceMetrics?.blockedYears || [];
    assert.ok(blockedYears.includes(2023), '2023 must be blocked');
  });

  test('9. DLPACanonicalBindingAudit valida com status CONSISTENT', () => {
    const auditResult = DLPACanonicalBindingAudit.validate({
      engineOutput: exec,
      adapterOutput: result
    });
    expect(auditResult.bindingStatus).toBe('CONSISTENT');
  });

  test('10. DLPAUIConsistencyAudit retorna DLPA_UI_CONSISTENT', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    const resolvedHorizon = DLPARecoveryHorizonResolver.resolve(
      exec.patrimonialRecoveryHorizon,
      exec.capitalRecoverability
    );
    const capitalSocial = 121233.21;
    const endingEquity = 59620.26;
    const capitalPreservedPercent = (endingEquity / capitalSocial) * 100;

    const status = DLPAUIConsistencyAudit.validate({
      horizonClassification: resolvedHorizon.classification,
      horizonFormatted: resolvedHorizon.formatted,
      horizonAvailable: exec.patrimonialRecoveryHorizon.available !== false,
      recoverabilityClassification: exec.capitalRecoverability.classification,
      cpsScore: resolvedCps.score,
      cpsHorizonScore: exec.capitalPreservationScore.components.horizonScore,
      radarStatus: result.resolvedCapitalStatus!,
      capitalPreservedPercent,
      recoveryThesis: exec.governanceInterpretation.recoveryThesis,
      distributionCapacity: exec.capitalRecoveryRequirement.classification
    });

    expect(status).toBe('DLPA_UI_CONSISTENT');
  });

  test('11. UI specific tests (ensuring no legacy fields/text render directly in UI outputs)', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    const resolvedHorizon = DLPARecoveryHorizonResolver.resolve(
      exec.patrimonialRecoveryHorizon,
      exec.capitalRecoverability
    );

    // Concatenate all visual narrative fields to simulate renderedText
    const renderedText = `${resolvedHorizon.formatted} ${resolvedHorizon.classification} ${resolvedHorizon.narrative} ${resolvedCps.rationale}`;

    expect(renderedText).not.toContain('0,0 anos');
    expect(renderedText).not.toContain('Média dos ciclos históricos positivos');
    expect(renderedText).not.toContain('Horizonte (90 pts × 15%)');
  });

  test('12. DLPALegacyFieldScanner detects legacy fields and values', () => {
    const scanStatus = DLPALegacyFieldScanner.scan(result);
    expect(scanStatus).toBe('CANONICAL');

    // Simulate legacy payload with legacy key
    const dirtyPayload = {
      ...result,
      legacyRecoveryYears: 1.2
    };
    expect(DLPALegacyFieldScanner.scan(dirtyPayload)).toBe('LEGACY_PAYLOAD_DETECTED');
  });

  test('13. DLPACanonicalPayloadEnforcer enforces payload contract', () => {
    const enforcerResult = DLPACanonicalPayloadEnforcer.enforce(result);
    expect(enforcerResult.status).toBe('CANONICAL');

    const dirtyPayload = {
      ...result,
      legacyCpsScore: 44
    };
    expect(DLPACanonicalPayloadEnforcer.enforce(dirtyPayload).status).toBe('LEGACY_DETECTED');
  });

  test('14. DLPAUIHardFailAudit registers consistency rules correctly', () => {
    const resolvedCps = DLPACanonicalScoreResolver.resolve(exec.capitalPreservationScore);
    const resolvedHorizon = DLPARecoveryHorizonResolver.resolve(
      exec.patrimonialRecoveryHorizon,
      exec.capitalRecoverability
    );
    const capitalSocial = 121233.21;
    const endingEquity = 59620.26;
    const capitalPreservedPercent = (endingEquity / capitalSocial) * 100;

    const hardFailStatus = DLPAUIHardFailAudit.validate({
      horizonClassification: resolvedHorizon.classification,
      horizonFormatted: resolvedHorizon.formatted,
      horizonAvailable: exec.patrimonialRecoveryHorizon.available !== false,
      recoverabilityClassification: exec.capitalRecoverability.classification,
      cpsScore: resolvedCps.score,
      cpsHorizonScore: exec.capitalPreservationScore.components.horizonScore,
      radarStatus: result.resolvedCapitalStatus!,
      capitalPreservedPercent,
      recoveryThesis: exec.governanceInterpretation.recoveryThesis,
      distributionCapacity: exec.capitalRecoveryRequirement.classification
    });

    expect(hardFailStatus).toBe('DLPA_UI_CONSISTENT');

    // Introduce inconsistency (Rule 1 violation)
    const badFailStatus = DLPAUIHardFailAudit.validate({
      horizonClassification: resolvedHorizon.classification,
      horizonFormatted: resolvedHorizon.formatted,
      horizonAvailable: exec.patrimonialRecoveryHorizon.available !== false,
      recoverabilityClassification: exec.capitalRecoverability.classification,
      cpsScore: resolvedCps.score,
      cpsHorizonScore: 90, // should be 25
      radarStatus: result.resolvedCapitalStatus!,
      capitalPreservedPercent,
      recoveryThesis: exec.governanceInterpretation.recoveryThesis,
      distributionCapacity: exec.capitalRecoveryRequirement.classification
    });

    expect(badFailStatus).toBe('DLPA_UI_HARD_FAIL');
  });

  test('15. Hard assert no adapter: Se context.lifecycle.analysisYear existir, nenhum ciclo futuro pode ser usado', () => {
    const dbDataWithFuture = [
      { year: 2022, conta: 'dummy', val: 0 },
      { year: 2023, conta: 'future', val: 100 }
    ];
    const res = CapitalGovernanceAdapter.process(
      dbDataWithFuture,
      lucroLiquido,
      retainedEarnings,
      dividendos,
      plInicio,
      plFim,
      aumentoCapital,
      financialRuntimeContext as any,
      allHistoryData
    );
    const blockedYears = res.executiveLayer?.patrimonialRecoveryHorizon?.sourceMetrics?.blockedYears || [];
    assert.ok(blockedYears.includes(2023), '2023 must be in blockedYears');
  });

  test('16. Falha se filterYear cair para fallback quando existir analysisYear', () => {
    const badContext = {
      lifecycle: {
        foundationYear: 2020
      },
      lifecycleProfile: {
        lifecycleStage: 'INITIAL_CAPITALIZATION'
      }
    };

    assert.throws(() => {
      CapitalGovernanceAdapter.process(
        dbDataDLPA,
        lucroLiquido,
        retainedEarnings,
        dividendos,
        plInicio,
        plFim,
        aumentoCapital,
        badContext as any,
        allHistoryData
      );
    }, /DLPA_UI_HARD_FAIL: Contexto executivo presente mas analysisYear está ausente/);
  });
});
