import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardNarrative } from '../src/lib/board-narrative-engine';
import { BoardNarrativeInput, BoardNarrativeReportLike } from '../src/lib/board-narrative-types';
import { ExecutiveFinancialStory } from '../src/lib/executive-financial-story-types';
import { mapReportToBoardNarrativeInput } from '../src/lib/board-narrative-mapper';

describe('Board Narrative Layer v1.0', () => {

  const mockExecutiveFinancialStory: ExecutiveFinancialStory = {
    executiveBriefing: 'Briefing',
    boardMessage: 'Board Msg',
    partnerMessage: 'Partner Msg',
    managementMessage: 'Mgmt Msg',
    advisoryMessage: 'Adv Msg',
    decisionQuestions: ['Q1', 'Q2'],
    fiduciaryAttentionPoints: ['Att 1', 'Att 2'],
    recommendedDiscussionAgenda: ['Agenda 1'],
    fiduciaryDisclaimer: 'Disclaimer'
  };

  test('should return undefined if no executiveFinancialStory is provided', () => {
    assert.strictEqual(buildBoardNarrative(undefined), undefined);
    assert.strictEqual(buildBoardNarrative({}), undefined);
  });

  test('should map and build BoardNarrative correctly', () => {
    const reportLike: BoardNarrativeReportLike = {
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input: BoardNarrativeInput = mapReportToBoardNarrativeInput(reportLike);
    const result = buildBoardNarrative(input);

    assert.ok(result);
    assert.strictEqual(result.boardBriefing, 'Briefing');
    assert.strictEqual(result.boardMessage, 'Board Msg');
    assert.deepStrictEqual(result.executiveAgenda, ['Agenda 1']);
    assert.deepStrictEqual(result.fiduciaryQuestions, ['Q1', 'Q2']);
    assert.deepStrictEqual(result.decisionPoints, ['Att 1', 'Att 2']);
    assert.deepStrictEqual(result.riskOversightAgenda, ['Att 1', 'Att 2']);
    assert.deepStrictEqual(result.recommendedBoardActions, ['Agenda 1']);
    assert.strictEqual(result.fiduciaryDisclaimer, 'Disclaimer');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    // Simulate the integration logic
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithExecutiveStory = {
      ...baseline,
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input = mapReportToBoardNarrativeInput(reportWithExecutiveStory);
    const boardNarrative = buildBoardNarrative(input);

    const reportWithBoardNarrative = {
      ...reportWithExecutiveStory,
      ...(boardNarrative && { boardNarrative })
    };

    assert.deepStrictEqual(reportWithBoardNarrative.scores, baseline.scores);
    assert.deepStrictEqual(reportWithBoardNarrative.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithBoardNarrative.classifications, baseline.classifications);
    assert.ok(reportWithBoardNarrative.boardNarrative);
  });

});
