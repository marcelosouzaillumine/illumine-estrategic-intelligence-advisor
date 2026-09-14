import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { DLPAFiduciaryInterpretationEngine } from '../src/capabilities/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { LifecycleSemanticConsumptionGuard } from '../src/workspace/runtime/lifecycle/LifecycleSemanticConsumptionGuard';
import { LifecycleSemanticViolationScanner } from '../src/workspace/runtime/lifecycle/LifecycleSemanticViolationScanner';
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('DLPA Lifecycle Semantic Consumption E2E Tests (DLSCF v1.0)', () => {

  const buildMockContext = (lifecycleProfile?: any): any => {
    if (!lifecycleProfile) return undefined;
    return {
      lifecycleProfile,
      contextualConfidence: 'HIGH' as const,
      interpretationWarnings: [],
      requiredDisclosures: [],
      auditTrail: []
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

  test('1. Verify lifecycleStage === "INITIAL_CAPITALIZATION" for early stage setup', () => {
    const profile = getEarlyStageProfile();
    assert.strictEqual(profile.lifecycleStage, 'INITIAL_CAPITALIZATION');
  });

  test('2. Verify forbidden governance labels are blocked in scanner', () => {
    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'Isso é uma Governança Crítica');
    }, /EARLY_STAGE_SEMANTIC_CONTRADICTION/);
  });

  test('3. Verify forbidden capital status labels are blocked in scanner', () => {
    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'Temos High Capital Erosion');
    }, /EARLY_STAGE_SEMANTIC_CONTRADICTION/);
  });

  test('4. Verify forbidden protection labels are blocked in scanner', () => {
    assert.throws(() => {
      LifecycleSemanticViolationScanner.scan('INITIAL_CAPITALIZATION', 'Some Weak Capital Protection issue');
    }, /EARLY_STAGE_SEMANTIC_CONTRADICTION/);
  });

  test('5. Verify DLPAFiduciaryInterpretationEngine outputs rawCapitalStatus and semanticCapitalStatus', () => {
    const ctx = buildMockContext(getEarlyStageProfile());
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context: ctx,
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

    assert.strictEqual(output.rawCapitalStatus, 'High Capital Erosion');
    assert.strictEqual(output.semanticCapitalStatus, 'Capitalização em Consolidação');
    assert.strictEqual(output.resolvedGovernanceStatus, 'Governança em Estruturação');
  });

  test('6. Verify CapitalGovernanceAdapter output exposes semantic fields and source', async () => {
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
    assert.strictEqual(result.inference?.metrics.resolvedGovernanceStatus, 'Governança em Estruturação');
    assert.strictEqual(result.inference?.metrics.resolvedCapitalStatus, 'Capitalização em Consolidação');
    assert.strictEqual(result.inference?.metrics.semanticSource, 'ELSA');
  });

  test('7. Verify Board Pack Document Runtime appends Semantic Authority section', () => {
    const report: any = {
      tenantId: 'tenant-123',
      cycleReference: '2022',
      compliance: {
        runtimeMode: 'FULL_FINANCIAL_VIEW',
        confidenceLevel: 'HIGH_CONFIDENCE',
        dataCompleteness: 1,
        causalDepth: 'DEEP',
        narrativeRestrictions: [],
        auditFlags: []
      },
      inferences: {
        'CapitalGovernanceAdapter': {
          metrics: {
            cgs: 31,
            cgsStatus: 'Governança em Estruturação',
            cpi: 0.4918,
            cpiStatus: 'Capitalização em Consolidação',
            cdi: 0,
            cdiStatus: 'Independent',
            erir: 0.49,
            erirStatus: 'Moderate',
            cmi: 50,
            trajectory: 'STABILIZING',
            capitalSocial: 121233.21,
            patrimonioLiquido: 59620.26,
            lucroLiquido: -68548.88,
            dividendos: 0,
            capitalizacoesAcumuladas: 0,
            capitalInjections: 0,
            lifecycleStage: 'INITIAL_CAPITALIZATION',
            resolvedGovernanceStatus: 'Governança em Estruturação',
            resolvedCapitalStatus: 'Capitalização em Consolidação',
            resolvedNarrativeProfile: 'EARLY_STAGE'
          },
          narrative: {
            diagnostic: 'A companhia encontra-se em fase inicial de capitalização...',
            cause: '', consequence: '', sensitivity: '', risk: '', priority: '', strategicMovement: ''
          },
          confidence: 'HIGH',
          score: 31
        }
      },
      executedEngines: ['CapitalGovernanceAdapter'],
      globalConfidence: 'HIGH'
    };

    const doc = InstitutionalBoardPackDocumentRuntime.generateDocument(report, 'BOARD');
    const lifecycleContextSec = doc.markdownSections.lifecycleContext;
    
    assert.ok(lifecycleContextSec.includes('## Consumo da Autoridade Semântica'));
    assert.ok(lifecycleContextSec.includes('**Lifecycle Stage**: INITIAL_CAPITALIZATION'));
    assert.ok(lifecycleContextSec.includes('**Semantic Authority**: ELSA'));
    assert.ok(lifecycleContextSec.includes('**Governance Status**: Governança em Estruturação'));
    assert.ok(lifecycleContextSec.includes('**Capital Status**: Capitalização em Consolidação'));
    assert.ok(lifecycleContextSec.includes('**Narrative Profile**: EARLY_STAGE'));
  });

  test('8. Verify LifecycleSemanticConsumptionGuard blocks bypassed profiles', () => {
    const ctx = buildMockContext(getEarlyStageProfile());
    
    // Valid consumed values matching the semantic authority
    assert.doesNotThrow(() => {
      LifecycleSemanticConsumptionGuard.assertLifecycleSemanticConsumption(ctx, {
        governanceStatus: 'Governança em Estruturação',
        capitalStatus: 'Capitalização em Consolidação'
      });
    });

    // Mismatched governance status should throw
    assert.throws(() => {
      LifecycleSemanticConsumptionGuard.assertLifecycleSemanticConsumption(ctx, {
        governanceStatus: 'Governança Crítica',
        capitalStatus: 'Capitalização em Consolidação'
      });
    }, /LIFECYCLE_PROFILE_NOT_CONSUMED/);
  });

});
