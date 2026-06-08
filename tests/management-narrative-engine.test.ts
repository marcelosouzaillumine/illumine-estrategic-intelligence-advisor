import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildManagementNarrative } from '../src/lib/management-narrative-engine';
import { ManagementNarrativeInput, ManagementNarrativeReportLike } from '../src/lib/management-narrative-types';
import { ExecutiveFinancialStory } from '../src/lib/executive-financial-story-types';
import { mapReportToManagementNarrativeInput } from '../src/lib/management-narrative-mapper';

describe('Management Narrative Layer v1.0', () => {

  const mockExecutiveFinancialStory: ExecutiveFinancialStory = {
    executiveBriefing: 'Value Creation Briefing',
    boardMessage: 'Capital Preservation Message',
    partnerMessage: 'Shareholder & Distribution Message',
    managementMessage: 'Management Briefing Message',
    advisoryMessage: 'Long Term Sustainability Message',
    decisionQuestions: ['Q1', 'Q2'],
    fiduciaryAttentionPoints: ['Att 1', 'Att 2'],
    recommendedDiscussionAgenda: ['Agenda 1'],
    fiduciaryDisclaimer: 'Disclaimer'
  };

  test('should return undefined if no executiveFinancialStory is provided', () => {
    assert.strictEqual(buildManagementNarrative(undefined), undefined);
    assert.strictEqual(buildManagementNarrative({}), undefined);
  });

  test('should map and build ManagementNarrative correctly', () => {
    const reportLike: ManagementNarrativeReportLike = {
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input: ManagementNarrativeInput = mapReportToManagementNarrativeInput(reportLike);
    const result = buildManagementNarrative(input);

    assert.ok(result);
    assert.strictEqual(result.managementBriefing, 'Management Briefing Message');
    assert.deepStrictEqual(result.executionPriorities, ['Att 1', 'Att 2']);
    assert.deepStrictEqual(result.managementActionPlan, ['Agenda 1']);
    assert.deepStrictEqual(result.accountabilityAgenda, ['Q1', 'Q2']);
    assert.deepStrictEqual(result.operationalAttentionPoints, ['Att 1', 'Att 2']);
    assert.deepStrictEqual(result.leadershipAlignmentAgenda, ['Agenda 1']);
    assert.deepStrictEqual(result.performanceMonitoringAgenda, ['Q1', 'Q2']);
    assert.strictEqual(result.fiduciaryDisclaimer, 'Esta narrativa gerencial deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithPartnerNarrative = {
      ...baseline,
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input = mapReportToManagementNarrativeInput(reportWithPartnerNarrative);
    const managementNarrative = buildManagementNarrative(input);

    const reportWithManagementNarrative = {
      ...reportWithPartnerNarrative,
      ...(managementNarrative && { managementNarrative })
    };

    assert.deepStrictEqual(reportWithManagementNarrative.scores, baseline.scores);
    assert.deepStrictEqual(reportWithManagementNarrative.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithManagementNarrative.classifications, baseline.classifications);
    assert.ok(reportWithManagementNarrative.managementNarrative);
  });

});
