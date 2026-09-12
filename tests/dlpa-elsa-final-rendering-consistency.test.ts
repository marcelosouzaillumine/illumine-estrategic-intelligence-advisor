import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { DLPAExecutiveRenderingGuard } from '../src/workspace/runtime/lifecycle/DLPAExecutiveRenderingGuard';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('DLPA ELSA Final Rendering Consistency Tests', () => {

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

  test('1. Verify semanticSource === ELSA for early-stage context', async () => {
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
    assert.strictEqual(result.inference?.metrics.semantic?.semanticSource, 'ELSA');
  });

  test('2. Executive metrics object does not contain mature labels when semanticSource === ELSA', async () => {
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
    assert.strictEqual(metrics.resolvedGovernanceStatus, 'Governança em Estruturação');
    assert.strictEqual(metrics.resolvedCapitalStatus, 'Capitalização em Consolidação');
    assert.strictEqual(metrics.semantic?.resolvedGovernanceStatus, 'Governança em Estruturação');
    assert.strictEqual(metrics.semantic?.resolvedCapitalStatus, 'Capitalização em Consolidação');
  });

  test('3. Verify violation DLPA_LEGACY_LABEL_RENDERED_UNDER_ELSA is returned if legacy labels are passed to rendering under ELSA', () => {
    const violations = DLPAExecutiveRenderingGuard.validateExecutiveDisplay(
      'ELSA',
      'INITIAL_CAPITALIZATION',
      ['Governança Crítica', 'Capitalização em Consolidação']
    );
    assert.strictEqual(violations.length, 1);
    assert.strictEqual(violations[0].code, 'DLPA_LEGACY_LABEL_RENDERED_UNDER_ELSA');
    assert.strictEqual(violations[0].severity, 'CRITICAL');
    assert.strictEqual(violations[0].blocked, true);
  });

  test('4. Verify raw statuses are preserved in the technical audit payload', async () => {
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
    assert.strictEqual(metrics.semantic?.rawGovernanceStatus, 'Governança Crítica');
    assert.strictEqual(metrics.semantic?.rawCapitalStatus, 'Severe Erosion');
  });

  test('5. Validate that Board Pack document markdown does not contain mature/legacy labels under ELSA', () => {
    const report: ExecutiveIntelligenceReport = {
      runtimeMetadata: { lineageHash: 'BOARD-PACK-TEST-HASH', historicalCyclesAvailable: 3, auditTrail: [] },
      scores: { composite: 31, financial: 31, operational: 31, governance: 31, structural: 31 },
      institutionalContext: { tenantId: 'test-tenant', currentCycle: '2022' },
      inferences: {
        'CapitalGovernanceAdapter': {
          domain: 'Capital Governance Engine (CGE)',
          metrics: {
            cgs: 31,
            cgsStatus: 'Governança Crítica',
            cpi: 0.49,
            cpiStatus: 'High Capital Erosion',
            capitalSocial: 121233.21,
            patrimonioLiquido: 59620.26,
            semanticSource: 'ELSA',
            resolvedGovernanceStatus: 'Governança em Estruturação',
            resolvedCapitalStatus: 'Capitalização em Consolidação'
          },
          narrative: {
            diagnostic: 'Fase Inicial de Capitalização'
          }
        }
      }
    } as any;

    const documentResult = InstitutionalBoardPackDocumentRuntime.generateDocument(report, 'BOARD');
    const summaryMarkdown = documentResult.markdownSections.capitalGovernanceSummary || '';
    const preservationMarkdown = documentResult.markdownSections.capitalPreservationAnalysis || '';

    // Verify presence of resolved values and technical note
    assert.ok(summaryMarkdown.includes('Governança em Estruturação'));
    assert.ok(preservationMarkdown.includes('Capitalização em Consolidação'));
    assert.ok(summaryMarkdown.includes('A severidade matemática original foi preservada para auditoria interna'));

    // Verify absence of mature/legacy labels
    assert.ok(!summaryMarkdown.includes('Governança Crítica'));
    assert.ok(!summaryMarkdown.includes('WEAK CAPITAL PROTECTION'));
    assert.ok(!preservationMarkdown.includes('High Capital Erosion'));
  });

});
