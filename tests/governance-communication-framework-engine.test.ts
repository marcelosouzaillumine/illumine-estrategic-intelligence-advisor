import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildGovernanceCommunicationFramework } from '../src/lib/governance-communication-framework-engine';
import { GovernanceCommunicationFrameworkInput, GovernanceCommunicationFrameworkReportLike } from '../src/lib/governance-communication-framework-types';
import { mapReportToGovernanceCommunicationFrameworkInput } from '../src/lib/governance-communication-framework-mapper';

import { BoardNarrative } from '../src/lib/board-narrative-types';
import { AdvisoryNarrative } from '../src/lib/advisory-narrative-types';
import { PartnerNarrative } from '../src/lib/partner-narrative-types';
import { ManagementNarrative } from '../src/lib/management-narrative-types';

describe('Governance Communication Framework v1.0', () => {

  const mockBoardNarrative: BoardNarrative = {
    boardBriefing: '',
    boardMessage: '',
    executiveAgenda: ['B1'],
    fiduciaryQuestions: ['BQ1'],
    decisionPoints: ['BD1'],
    riskOversightAgenda: [],
    recommendedBoardActions: [],
    fiduciaryDisclaimer: ''
  };

  const mockAdvisoryNarrative: AdvisoryNarrative = {
    advisoryRecommendations: ['A1'],
    executiveReflectionQuestions: ['AQ1'],
    systemicObservations: ['AD1'],
    advisoryExecutiveSummary: '',
    strategicOpportunities: [],
    advisoryHypotheses: [],
    fiduciaryDisclaimer: ''
  };

  const mockPartnerNarrative: PartnerNarrative = {
    strategicOwnershipAgenda: ['P1'],
    partnerReflectionQuestions: ['PQ1', 'PD1'],
    shareholderMessage: '',
    valueCreationNarrative: '',
    capitalPreservationNarrative: '',
    patrimonialGrowthNarrative: '',
    longTermSustainabilityNarrative: '',
    distributionPerspective: '',
    fiduciaryDisclaimer: ''
  };

  const mockManagementNarrative: ManagementNarrative = {
    managementActionPlan: ['M1'],
    accountabilityAgenda: ['MQ1'],
    operationalAttentionPoints: ['MD1'],
    managementBriefing: '',
    executionPriorities: [],
    leadershipAlignmentAgenda: [],
    performanceMonitoringAgenda: [],
    fiduciaryDisclaimer: ''
  };

  test('should return undefined if no input is provided', () => {
    assert.strictEqual(buildGovernanceCommunicationFramework(undefined), undefined);
  });

  test('should return undefined if no narratives are provided in the input', () => {
    assert.strictEqual(buildGovernanceCommunicationFramework({}), undefined);
  });

  test('should correctly aggregate narratives into GCF', () => {
    const reportLike: GovernanceCommunicationFrameworkReportLike = {
      boardNarrative: mockBoardNarrative,
      advisoryNarrative: mockAdvisoryNarrative,
      partnerNarrative: mockPartnerNarrative,
      managementNarrative: mockManagementNarrative
    };

    const input: GovernanceCommunicationFrameworkInput = mapReportToGovernanceCommunicationFrameworkInput(reportLike);
    const result = buildGovernanceCommunicationFramework(input);

    assert.ok(result);
    assert.deepStrictEqual(result.integratedExecutiveAgenda, ['B1', 'A1', 'P1', 'M1']);
    assert.deepStrictEqual(result.integratedDecisionAgenda, ['BQ1', 'AQ1', 'PQ1', 'PD1', 'MQ1']);
    assert.deepStrictEqual(result.integratedAttentionPoints, ['BD1', 'AD1', 'PQ1', 'PD1', 'MD1']);
    assert.strictEqual(result.institutionalExecutiveSummary, 'Consolidação institucional das comunicações executivas para Conselho, Advisors, Sócios e Gestão.');
    assert.strictEqual(result.fiduciaryDisclaimer, 'Este framework consolida exclusivamente as camadas de comunicação executiva da Illumine Governance™, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithManagementNarrative = {
      ...baseline,
      boardNarrative: mockBoardNarrative
    };

    const input = mapReportToGovernanceCommunicationFrameworkInput(reportWithManagementNarrative);
    const governanceCommunicationFramework = buildGovernanceCommunicationFramework(input);

    const reportWithGovernanceFramework = {
      ...reportWithManagementNarrative,
      ...(governanceCommunicationFramework && { governanceCommunicationFramework })
    };

    assert.deepStrictEqual(reportWithGovernanceFramework.scores, baseline.scores);
    assert.deepStrictEqual(reportWithGovernanceFramework.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithGovernanceFramework.classifications, baseline.classifications);
    assert.ok(reportWithGovernanceFramework.governanceCommunicationFramework);
  });

});
