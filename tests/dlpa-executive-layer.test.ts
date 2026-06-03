import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/core/runtime/capital-governance/capital-governance-adapter';

describe('Executive Layer Evaluation v2.3', () => {
  test('Granatum 2022 dataset produces expected executive outputs', () => {
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
      }
    ];

    const financialRuntimeContext = {
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
    assert.ok(exec, "Executive Layer missing");

    // Test preservation/consumption status
    assert.strictEqual(exec.capitalPreservationStatus.value.toFixed(3), '0.492');
    assert.strictEqual(exec.capitalPreservationStatus.classification, 'Capital Severamente Fragilizado');
    
    assert.strictEqual(exec.capitalErosionRisk.value.toFixed(3), '0.565');
    assert.strictEqual(exec.capitalErosionRisk.classification, 'Crítico');
    assert.strictEqual(exec.capitalErosionRisk.capitalConsumedAmount.toFixed(2), '68548.88');

    assert.strictEqual(exec.shareholderDependencyNarrative.value.toFixed(2), '2.03');
    assert.strictEqual(exec.shareholderDependencyNarrative.classification, 'Crítica');

    assert.strictEqual(exec.capitalRecoveryRequirement.capitalRecoveryRequired.toFixed(2), '68548.88');
    assert.strictEqual(exec.capitalRecoveryRequirement.value.toFixed(3), '0.565');
    
    assert.strictEqual(exec.patrimonialRecoveryHorizon.formatted, 'Não Estimável');
    assert.strictEqual(exec.capitalRecoverability.classification, 'Não Estimável');

    // Granatum 2022 CPS must result in exactly 38/100
    assert.strictEqual(exec.capitalPreservationScore.value, 38);
    assert.strictEqual(exec.capitalPreservationScore.classification, 'Capital em Recuperação');

    // Test Board Decision Framework (8 questions)
    const questions = exec.boardDecisionSupport.value;
    assert.strictEqual(questions.length, 8, "Decision framework must contain exactly 8 questions");
    
    const preservationQuestion = questions.find((q: any) => q.question.includes('capital dos sócios foi preservado'));
    assert.ok(preservationQuestion, "Preservation question missing");
    assert.ok(preservationQuestion.answer.includes('Parcialmente. 49,2% permanece preservado'), "Preservation answer must contain correct percentages");

    const recoveryQuestion = questions.find((q: any) => q.question.includes('ainda precisa ser recuperado'));
    assert.ok(recoveryQuestion, "Recovery question missing");
    assert.ok(recoveryQuestion.answer.includes('R$ 68.548,88'), "Recovery answer must show correct amount");

    const whatIfQuestion = questions.find((q: any) => q.question.includes('Se nada for feito'));
    assert.ok(whatIfQuestion, "What-if question missing");
    assert.ok(whatIfQuestion.answer.includes('A continuidade da destruição de resultados'), "What-if answer must match governance standard");
  });

  test('Mandatory Scenario: Cenário Saudável', () => {
    const dbDataDLPA: any[] = [{ year: 2022, conta: 'dummy', val: 0 }];
    const lucroLiquido = 15000.00;
    const retainedEarnings = 15000.00;
    const dividendos = 0;
    const plInicio = 100000.00;
    const plFim = 115000.00;
    const aumentoCapital = 100000.00;
    const allHistoryData: any[] = [
      {
        year: 2022,
        docType: 'bp',
        conta: 'capital social',
        val: 100000.00
      }
    ];

    const result = CapitalGovernanceAdapter.process(
      dbDataDLPA,
      lucroLiquido,
      retainedEarnings,
      dividendos,
      plInicio,
      plFim,
      aumentoCapital,
      undefined,
      allHistoryData
    );

    const exec = result.executiveLayer;
    assert.ok(exec, "Executive Layer missing");

    // Capital Preservado
    assert.strictEqual(exec.capitalPreservationStatus.classification, 'Capital Preservado');
    // CPS > 90
    assert.ok(exec.capitalPreservationScore.value > 90, `CPS should be > 90, got: ${exec.capitalPreservationScore.value}`);
  });

  test('Mandatory Scenario: Cenário Turnaround', () => {
    const dbDataDLPA: any[] = [{ year: 2022, conta: 'prejuízos acumulados', val: -50000.00 }];
    const lucroLiquido = 15000.00;
    const retainedEarnings = 15000.00;
    const dividendos = 0;
    const plInicio = 50000.00;
    const plFim = 65000.00;
    const aumentoCapital = 100000.00; 
    const allHistoryData: any[] = [
      {
        year: 2022,
        docType: 'bp',
        conta: 'capital social',
        val: 100000.00
      }
    ];

    const result = CapitalGovernanceAdapter.process(
      dbDataDLPA,
      lucroLiquido,
      retainedEarnings,
      dividendos,
      plInicio,
      50000.00, // endingEquity exactly 50% of Capital Social
      aumentoCapital,
      undefined,
      allHistoryData
    );

    const exec = result.executiveLayer;
    assert.ok(exec, "Executive Layer missing");

    // Capital Fragilizado (50% do Capital)
    assert.strictEqual(exec.capitalPreservationStatus.value, 0.50);
    assert.strictEqual(exec.capitalPreservationStatus.classification, 'Capital Fragilizado');
    // Recuperabilidade Moderada (horizon is 50000 / 15000 = 3.33 years)
    assert.strictEqual(exec.capitalRecoverability.classification, 'Moderada');
  });

  test('Mandatory Scenario: Cenário Insolvente', () => {
    const dbDataDLPA: any[] = [{ year: 2022, conta: 'dummy', val: 0 }];
    const lucroLiquido = -15000.00;
    const retainedEarnings = -15000.00;
    const dividendos = 0;
    const plInicio = -5000.00;
    const plFim = -20000.00;
    const aumentoCapital = 100000.00;
    const allHistoryData: any[] = [
      {
        year: 2022,
        docType: 'bp',
        conta: 'capital social',
        val: 100000.00
      }
    ];

    const result = CapitalGovernanceAdapter.process(
      dbDataDLPA,
      lucroLiquido,
      retainedEarnings,
      dividendos,
      plInicio,
      plFim, // negative equity
      aumentoCapital,
      undefined,
      allHistoryData
    );

    const exec = result.executiveLayer;
    assert.ok(exec, "Executive Layer missing");

    // Capital Erodido
    assert.strictEqual(exec.capitalPreservationStatus.classification, 'Capital Erodido');
    // Recuperabilidade Comprometida
    assert.strictEqual(exec.capitalRecoverability.classification, 'Recuperabilidade Comprometida');
    // CPS <= 20
    assert.ok(exec.capitalPreservationScore.value <= 20, `CPS should be <= 20, got: ${exec.capitalPreservationScore.value}`);
  });

  test('Mandatory Scenario: Cenário Recuperação Acelerada', () => {
    const dbDataDLPA: any[] = [{ year: 2022, conta: 'dummy', val: 0 }];
    const lucroLiquido = 40000.00;
    const retainedEarnings = 40000.00;
    const dividendos = 0;
    const plInicio = 30000.00;
    const plFim = 30000.00; // 30% of capital social
    const aumentoCapital = 100000.00;
    const allHistoryData: any[] = [
      {
        year: 2022,
        docType: 'bp',
        conta: 'capital social',
        val: 100000.00
      }
    ];

    const result = CapitalGovernanceAdapter.process(
      dbDataDLPA,
      lucroLiquido,
      retainedEarnings,
      dividendos,
      plInicio,
      plFim,
      aumentoCapital,
      undefined,
      allHistoryData
    );

    const exec = result.executiveLayer;
    assert.ok(exec, "Executive Layer missing");

    // Capital em Recuperação (for CPS)
    assert.strictEqual(exec.capitalPreservationScore.classification, 'Capital em Recuperação');
    // Recuperabilidade Alta (horizon is 70000 / 40000 = 1.75 years < 2)
    assert.strictEqual(exec.capitalRecoverability.classification, 'Alta');
  });
});
