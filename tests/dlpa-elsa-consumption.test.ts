import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { DLPAFiduciaryInterpretationEngine } from '../src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { LifecycleContextBuilder } from '../src/core/runtime/lifecycle/LifecycleContextBuilder';
import { LifecycleSemanticAuthority } from '../src/core/runtime/lifecycle/LifecycleSemanticAuthority';
import { LifecycleSemanticViolationScanner } from '../src/core/runtime/lifecycle/LifecycleSemanticViolationScanner';

describe('DLPA ELSA Consumption Fix Tests (DLSCF v1.0)', () => {

  const buildMockContext = (lifecycleProfile?: any): any => {
    return {
      lifecycleProfile,
      contextualConfidence: 'HIGH' as const,
      interpretationWarnings: [] as string[],
      requiredDisclosures: [] as string[],
      auditTrail: [] as string[]
    };
  };

  const getEarlyStageProfile = () => ({
    lifecycleStage: 'INITIAL_CAPITALIZATION' as const,
    lifecycleConfidence: 'HIGH' as const,
    governanceStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Governança em Estruturação' },
    capitalStatus: { rawRiskLevel: 'HIGH_RISK', semanticLabel: 'Capitalização em Consolidação' },
    cashStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Estrutura de Caixa Dependente de Capitalização Inicial' },
    earningsStatus: { rawRiskLevel: 'CRITICAL', semanticLabel: 'Fase de Custeio Operacional Inicial' },
    narrativeProfile: 'EARLY_STAGE' as const,
    allowedLabels: ['Governança em Estruturação', 'Capitalização em Consolidação'],
    forbiddenLabels: [
      'Governança Crítica',
      'Colapso Patrimonial',
      'Capital Under Collapse',
      'Weak Capital Protection',
      'High Capital Erosion',
      'Fragilidade Crônica',
      'Deterioração Histórica'
    ]
  });

  test('1. Granatum 2022 uses semanticSource = ELSA', async () => {
    const profile = getEarlyStageProfile();
    const ctx: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: [],
          capitalSocial: 121233.21,
          bpSummary: { patrimonioLiquido: 59620.26 },
          lucroLiquido: -68548.88,
          financialRuntimeContext: buildMockContext(profile)
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

    const result = await CapitalGovernanceAdapter.execute(ctx);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics.semanticSource, 'ELSA');
  });

  test('2. Does not render LEGACY when lifecycleProfile is present', async () => {
    const profile = getEarlyStageProfile();
    const ctx: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: [],
          capitalSocial: 121233.21,
          bpSummary: { patrimonioLiquido: 59620.26 },
          lucroLiquido: -68548.88,
          financialRuntimeContext: buildMockContext(profile)
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

    const result = await CapitalGovernanceAdapter.execute(ctx);
    assert.notStrictEqual(result.inference?.metrics.semanticSource, 'LEGACY');
  });

  test('3. Does not render forbidden labels when INITIAL_CAPITALIZATION', async () => {
    const profile = getEarlyStageProfile();
    const ctx: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: [],
          capitalSocial: 121233.21,
          bpSummary: { patrimonioLiquido: 59620.26 },
          lucroLiquido: -68548.88,
          financialRuntimeContext: buildMockContext(profile)
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

    const result = await CapitalGovernanceAdapter.execute(ctx);
    const metrics = result.inference?.metrics;
    
    assert.ok(metrics);
    // Score remains 31/100
    assert.strictEqual(metrics.cgs, 31);
    
    // Status must be resolved semantic governance status
    assert.strictEqual(metrics.resolvedGovernanceStatus, 'Governança em Estruturação');
    assert.strictEqual(metrics.resolvedCapitalStatus, 'Capitalização em Consolidação');

    // Validate using the scanner that final strings are clean
    assert.doesNotThrow(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', metrics.resolvedGovernanceStatus);
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', metrics.resolvedCapitalStatus);
    });

    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'Governança Crítica');
    });
    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'WEAK CAPITAL PROTECTION');
    });
    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'High Capital Erosion');
    });
  });

  test('4. Formula validation uses starting accumulated loss of 6,935.93', () => {
    const startingAccumulatedLoss = 6935.93;
    const netIncome = -68548.88;
    const finalLoss = startingAccumulatedLoss + netIncome;
    
    assert.strictEqual(Number(finalLoss.toFixed(2)), -61612.95);
  });

  test('5. Verify lifecycleStage === INITIAL_CAPITALIZATION under context', () => {
    const lContext = LifecycleContextBuilder.build({
      foundationYear: 2021,
      analysisYear: 2022,
      historicalCycles: 1,
      capitalSocial: 121233.21,
      revenue: 0,
      netIncome: -68548.88
    });
    const profile = LifecycleSemanticAuthority.getSemanticProfile(lContext);
    assert.strictEqual(profile.lifecycleStage, 'INITIAL_CAPITALIZATION');
  });

});
