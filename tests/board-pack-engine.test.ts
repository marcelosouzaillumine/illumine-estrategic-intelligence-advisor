import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardPack } from '../src/lib/board-pack-engine';
import { BoardPackInput, BoardPackReportLike } from '../src/lib/board-pack-types';
import { mapReportToBoardPackInput } from '../src/lib/board-pack-mapper';

import { GovernanceCommunicationFramework } from '../src/lib/governance-communication-framework-types';
import { BoardNarrative } from '../src/lib/board-narrative-types';
import { AdvisoryNarrative } from '../src/lib/advisory-narrative-types';
import { PartnerNarrative } from '../src/lib/partner-narrative-types';
import { ManagementNarrative } from '../src/lib/management-narrative-types';
import { UnifiedFinancialNarrative } from '../src/lib/unified-financial-narrative-types';

describe('Board Pack Generator v1.0', () => {

  const mockGCF: GovernanceCommunicationFramework = {
    institutionalExecutiveSummary: '',
    integratedExecutiveAgenda: ['B1', 'A1'],
    integratedDecisionAgenda: ['BQ1', 'AQ1'],
    integratedAttentionPoints: ['BD1', 'AD1'],
    stakeholderCommunicationMatrix: {
      board: '',
      advisory: '',
      partners: '',
      management: ''
    },
    fiduciaryDisclaimer: ''
  };

  const mockBoardNarrative: BoardNarrative = {
    boardBriefing: '',
    boardMessage: 'Board Message 123',
    executiveAgenda: ['B1'],
    fiduciaryQuestions: ['BQ1'],
    decisionPoints: ['BD1'],
    riskOversightAgenda: ['BR1'],
    recommendedBoardActions: ['BA1'],
    fiduciaryDisclaimer: ''
  };

  const mockAdvisoryNarrative: AdvisoryNarrative = {
    advisoryRecommendations: [],
    executiveReflectionQuestions: [],
    systemicObservations: [],
    advisoryExecutiveSummary: 'Advisory View',
    strategicOpportunities: [],
    advisoryHypotheses: [],
    fiduciaryDisclaimer: ''
  };

  const mockPartnerNarrative: PartnerNarrative = {
    strategicOwnershipAgenda: [],
    partnerReflectionQuestions: [],
    shareholderMessage: 'Partner View',
    valueCreationNarrative: '',
    capitalPreservationNarrative: '',
    patrimonialGrowthNarrative: '',
    longTermSustainabilityNarrative: '',
    distributionPerspective: '',
    fiduciaryDisclaimer: ''
  };

  const mockManagementNarrative: ManagementNarrative = {
    managementActionPlan: [],
    accountabilityAgenda: [],
    operationalAttentionPoints: [],
    managementBriefing: 'Management View',
    executionPriorities: [],
    leadershipAlignmentAgenda: [],
    performanceMonitoringAgenda: [],
    fiduciaryDisclaimer: ''
  };

  const mockUFNE: UnifiedFinancialNarrative = {
    valueCreationSummary: 'VCS',
    liquidityAndCashSummary: 'LCS',
    patrimonialHealthSummary: 'PHS',
    capitalAllocationSummary: 'CAS',
    keyStrengths: [],
    keyRisks: [],
    executiveAttentionPoints: [],
    fiduciaryDisclaimer: ''
  };

  test('should return undefined if no input or GCF is provided', () => {
    assert.strictEqual(buildBoardPack(undefined), undefined);
    assert.strictEqual(buildBoardPack({}), undefined);
  });

  test('should build BoardPack correctly', () => {
    const reportLike: BoardPackReportLike = {
      governanceCommunicationFramework: mockGCF,
      boardNarrative: mockBoardNarrative,
      advisoryNarrative: mockAdvisoryNarrative,
      partnerNarrative: mockPartnerNarrative,
      managementNarrative: mockManagementNarrative,
      unifiedFinancialNarrative: mockUFNE
    };

    const input: BoardPackInput = mapReportToBoardPackInput(reportLike);
    const result = buildBoardPack(input);

    assert.ok(result);
    assert.strictEqual(result.executiveCover, 'Este Board Pack consolida os principais temas fiduciários, estratégicos e institucionais identificados pela plataforma Illumine Governance™.');
    assert.strictEqual(result.institutionalSummary, 'VCS\n\nLCS\n\nPHS\n\nCAS');
    assert.deepStrictEqual(result.executiveAgenda, ['B1']);
    assert.deepStrictEqual(result.fiduciaryQuestions, ['BQ1']);
    assert.deepStrictEqual(result.decisionPoints, ['BD1']);
    assert.deepStrictEqual(result.strategicRisks, ['BQ1', 'BD1', 'BR1']);
    assert.deepStrictEqual(result.recommendedActions, ['BA1']);
    assert.strictEqual(result.boardMessage, 'Board Message 123');
    assert.strictEqual(result.advisoryPerspective, 'Advisory View');
    assert.strictEqual(result.partnerPerspective, 'Partner View');
    assert.strictEqual(result.managementPerspective, 'Management View');
    assert.strictEqual(result.governanceCommunicationSummary, 'B1\nA1\nBQ1\nAQ1\nBD1\nAD1');
    assert.strictEqual(result.fiduciaryDisclaimer, 'Este Board Pack consolida informações produzidas pelas camadas narrativas institucionais da Illumine Governance™. Nenhum indicador, score, classificação ou resultado fiduciário foi recalculado ou alterado durante sua geração.');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithGovernanceFramework = {
      ...baseline,
      governanceCommunicationFramework: mockGCF
    };

    const input = mapReportToBoardPackInput(reportWithGovernanceFramework);
    const boardPack = buildBoardPack(input);

    const reportWithBoardPack = {
      ...reportWithGovernanceFramework,
      ...(boardPack && { boardPack })
    };

    assert.deepStrictEqual(reportWithBoardPack.scores, baseline.scores);
    assert.deepStrictEqual(reportWithBoardPack.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithBoardPack.classifications, baseline.classifications);
    assert.ok(reportWithBoardPack.boardPack);
  });

});
