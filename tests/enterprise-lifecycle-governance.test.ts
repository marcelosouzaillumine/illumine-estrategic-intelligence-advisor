// tests/enterprise-lifecycle-governance.test.ts

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { LifecycleClassificationEngine } from '../src/workspace/runtime/lifecycle/LifecycleClassificationEngine';
import { LifecycleContextBuilder } from '../src/workspace/runtime/lifecycle/LifecycleContextBuilder';
import { LifecycleSemanticAuthority } from '../src/workspace/runtime/lifecycle/LifecycleSemanticAuthority';
import { LifecycleConsistencyValidator } from '../src/workspace/runtime/lifecycle/LifecycleConsistencyValidator';
import { DLPAFiduciaryInterpretationEngine } from '../src/capabilities/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { buildGovernanceScore } from '../src/runtime/adapters/CapitalGovernanceAdapter';

describe('ELSA / ELGF v2.0 - Enterprise Lifecycle Semantic Authority Tests', () => {

  test('Should classify early stage (INITIAL_CAPITALIZATION) correctly based on weighted scores', () => {
    // Foundation 2021 + Analysis 2022 -> age 1
    const params = {
      foundationYear: 2021,
      analysisYear: 2022,
      historicalCycles: 1,
      capitalSocial: 100000,
      revenue: 50000,
      netIncome: -20000
    };

    const result = LifecycleClassificationEngine.classify(params);
    assert.strictEqual(result.stage, 'INITIAL_CAPITALIZATION');
    assert.strictEqual(result.confidence, 'HIGH');
  });

  test('Should fallback to UNKNOWN_LIFECYCLE with LOW confidence when foundationYear is missing', () => {
    const params = {
      foundationYear: undefined,
      analysisYear: 2022,
      historicalCycles: 1,
      capitalSocial: 100000,
      revenue: 50000,
      netIncome: -20000
    };

    const result = LifecycleClassificationEngine.classify(params);
    assert.strictEqual(result.stage, 'UNKNOWN_LIFECYCLE');
    assert.strictEqual(result.confidence, 'LOW');
  });

  test('Should yield correct semantic overrides for early stage', () => {
    const context = LifecycleContextBuilder.build({
      foundationYear: 2021,
      analysisYear: 2022,
      historicalCycles: 1,
      capitalSocial: 100000,
      revenue: 0,
      netIncome: -30000
    });

    const profile = LifecycleSemanticAuthority.getSemanticProfile(context);
    assert.strictEqual(profile.lifecycleStage, 'INITIAL_CAPITALIZATION');
    assert.strictEqual(profile.governanceStatus.semanticLabel, 'Governança em Estruturação');
    assert.strictEqual(profile.capitalStatus.semanticLabel, 'Estrutura de Capital em Formação');
    assert.strictEqual(profile.cashStatus.semanticLabel, 'Estrutura de Caixa Dependente de Capitalização Inicial');
    assert.strictEqual(profile.earningsStatus.semanticLabel, 'Fase de Custeio Operacional Inicial');
  });

  test('Should trigger EARLY_STAGE_SEMANTIC_CONTRADICTION if a forbidden word is present in early stage texts', () => {
    const context = LifecycleContextBuilder.build({
      foundationYear: 2021,
      analysisYear: 2022,
      historicalCycles: 1,
      capitalSocial: 100000,
      revenue: 0,
      netIncome: -30000
    });

    const profile = LifecycleSemanticAuthority.getSemanticProfile(context);
    
    // Valid text should not throw
    const validResult = LifecycleConsistencyValidator.validate(profile, ['Operação em andamento normal']);
    assert.strictEqual(validResult.isValid, true);

    // Forbidden word should throw/violate
    const invalidResult = LifecycleConsistencyValidator.validate(profile, ['Ocorreu um Colapso Patrimonial grave']);
    assert.strictEqual(invalidResult.isValid, false);
    assert.strictEqual(invalidResult.violations[0].rule, 'EARLY_STAGE_SEMANTIC_CONTRADICTION');
  });

  test('buildGovernanceScore should respect ELSA overrides', () => {
    const context = {
      lifecycleProfile: {
        lifecycleStage: 'INITIAL_CAPITALIZATION',
        governanceStatus: {
          rawRiskLevel: 'CRITICAL',
          semanticLabel: 'Governança em Estruturação'
        }
      }
    };

    const scoreResult = buildGovernanceScore({
      preservationRatio: 0.49,
      netIncome: -68548.88,
      endingEquity: 59620.26,
      capitalSocial: 121233.21,
      cashPosition: 10000,
      hasSevereOrHighErosion: true,
      context
    });

    assert.strictEqual(scoreResult.status, 'Governança em Estruturação');
  });

  test('DLPAFiduciaryInterpretationEngine should validate and override narrative', () => {
    const context = {
      lifecycleProfile: {
        lifecycleStage: 'INITIAL_CAPITALIZATION' as const,
        lifecycleConfidence: 'HIGH' as const,
        governanceStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Governança em Estruturação' },
        capitalStatus: { rawRiskLevel: 'HIGH_RISK', semanticLabel: 'Estrutura de Capital em Formação' },
        cashStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Estrutura de Caixa Dependente de Capitalização Inicial' },
        earningsStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Fase de Custeio Operacional Inicial' },
        narrativeProfile: 'EARLY_STAGE' as const,
        allowedLabels: ['Governança em Estruturação'],
        forbiddenLabels: ['Colapso Patrimonial', 'Colapso de Capital']
      },
      contextualConfidence: 'HIGH' as const,
      interpretationWarnings: [],
      requiredDisclosures: [],
      auditTrail: []
    } as any;

    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2022 }],
      netIncome: -68548.88,
      retainedEarnings: -68548.88,
      totalDistributed: 0,
      startingEquity: 121233.21,
      endingEquity: 59620.26,
      capitalInjections: 0,
      operatingCashFlow: -5000,
      capitalSocial: 121233.21,
      lucrosPrejuizos: -61612.95,
      historicalCycles: []
    });

    assert.ok(output.governanceNarrative.includes('fase inicial de capitalização'));
    assert.ok(!output.governanceNarrative.includes('Colapso Patrimonial'));
  });

});
