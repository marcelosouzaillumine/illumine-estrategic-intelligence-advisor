import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildAdvisoryNarrative } from '../src/lib/advisory-narrative-engine';
import { AdvisoryNarrativeInput, AdvisoryNarrativeReportLike } from '../src/lib/advisory-narrative-types';
import { ExecutiveFinancialStory } from '../src/lib/executive-financial-story-types';
import { mapReportToAdvisoryNarrativeInput } from '../src/lib/advisory-narrative-mapper';

describe('Advisory Narrative Layer v1.0', () => {

  const mockExecutiveFinancialStory: ExecutiveFinancialStory = {
    executiveBriefing: 'Systemic Reading Brief',
    boardMessage: 'Board Msg',
    partnerMessage: 'Partner Msg',
    managementMessage: 'Mgmt Msg',
    advisoryMessage: 'Advisory Specific Message',
    decisionQuestions: ['Q1', 'Q2'],
    fiduciaryAttentionPoints: ['Att 1', 'Att 2'],
    recommendedDiscussionAgenda: ['Agenda 1'],
    fiduciaryDisclaimer: 'Disclaimer'
  };

  test('should return undefined if no executiveFinancialStory is provided', () => {
    assert.strictEqual(buildAdvisoryNarrative(undefined), undefined);
    assert.strictEqual(buildAdvisoryNarrative({}), undefined);
  });

  test('should map and build AdvisoryNarrative correctly', () => {
    const reportLike: AdvisoryNarrativeReportLike = {
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input: AdvisoryNarrativeInput = mapReportToAdvisoryNarrativeInput(reportLike);
    const result = buildAdvisoryNarrative(input);

    assert.ok(result);
    assert.strictEqual(result.advisoryExecutiveSummary, 'Systemic Reading Brief');
    assert.deepStrictEqual(result.strategicOpportunities, ['Agenda 1']);
    assert.deepStrictEqual(result.advisoryHypotheses, ['Att 1', 'Att 2']);
    assert.deepStrictEqual(result.advisoryRecommendations, ['Agenda 1']);
    assert.deepStrictEqual(result.executiveReflectionQuestions, ['Q1', 'Q2']);
    assert.deepStrictEqual(result.systemicObservations, ['Att 1', 'Att 2']);
    assert.strictEqual(result.fiduciaryDisclaimer, 'Esta narrativa consultiva deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithBoardNarrative = {
      ...baseline,
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input = mapReportToAdvisoryNarrativeInput(reportWithBoardNarrative);
    const advisoryNarrative = buildAdvisoryNarrative(input);

    const reportWithAdvisoryNarrative = {
      ...reportWithBoardNarrative,
      ...(advisoryNarrative && { advisoryNarrative })
    };

    assert.deepStrictEqual(reportWithAdvisoryNarrative.scores, baseline.scores);
    assert.deepStrictEqual(reportWithAdvisoryNarrative.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithAdvisoryNarrative.classifications, baseline.classifications);
    assert.ok(reportWithAdvisoryNarrative.advisoryNarrative);
  });

});
