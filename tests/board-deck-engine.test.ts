import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardDeck } from '../src/lib/board-deck-engine';
import { BoardDeckInput, BoardDeckReportLike } from '../src/lib/board-deck-types';
import { mapReportToBoardDeckInput } from '../src/lib/board-deck-mapper';
import { BoardPack } from '../src/lib/board-pack-types';

describe('Board Deck Generator v1.0', () => {

  const mockBoardPack: BoardPack = {
    executiveCover: 'Executive Cover Text',
    institutionalSummary: 'Institutional Summary Text',
    executiveAgenda: ['Agenda 1', 'Agenda 2'],
    fiduciaryQuestions: ['Q1'],
    decisionPoints: ['D1'],
    strategicRisks: ['R1'],
    recommendedActions: ['A1'],
    boardMessage: 'Board Msg',
    advisoryPerspective: 'Advisory Msg',
    partnerPerspective: 'Partner Msg',
    managementPerspective: 'Management Msg',
    governanceCommunicationSummary: 'Governance Summary',
    fiduciaryDisclaimer: 'Disclaimer'
  };

  test('should return undefined if no input or boardPack is provided', () => {
    assert.strictEqual(buildBoardDeck(undefined), undefined);
    assert.strictEqual(buildBoardDeck({}), undefined);
  });

  test('should build BoardDeck correctly', () => {
    const reportLike: BoardDeckReportLike = {
      boardPack: mockBoardPack
    };

    const input: BoardDeckInput = mapReportToBoardDeckInput(reportLike);
    const result = buildBoardDeck(input);

    assert.ok(result);
    
    // Validating specific requested slides
    assert.deepStrictEqual(result.coverSlide, {
      title: 'Board Meeting',
      subtitle: 'Illumine Governance™',
      content: ['Executive Cover Text']
    });
    
    assert.deepStrictEqual(result.executiveSummarySlide, {
      title: 'Executive Summary',
      content: ['Institutional Summary Text']
    });
    
    assert.deepStrictEqual(result.agendaSlide, {
      title: 'Executive Agenda',
      content: ['Agenda 1', 'Agenda 2']
    });
    
    assert.deepStrictEqual(result.decisionPointsSlide, {
      title: 'Decision Points',
      content: ['D1']
    });
    
    assert.deepStrictEqual(result.closingSlide, {
      title: 'Próximos Passos',
      content: ['Governance Summary']
    });
    
    assert.strictEqual(result.fiduciaryDisclaimer, 'Disclaimer');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithBoardPack = {
      ...baseline,
      boardPack: mockBoardPack
    };

    const input = mapReportToBoardDeckInput(reportWithBoardPack);
    const boardDeck = buildBoardDeck(input);

    const reportWithBoardDeck = {
      ...reportWithBoardPack,
      ...(boardDeck && { boardDeck })
    };

    assert.deepStrictEqual(reportWithBoardDeck.scores, baseline.scores);
    assert.deepStrictEqual(reportWithBoardDeck.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithBoardDeck.classifications, baseline.classifications);
    assert.ok(reportWithBoardDeck.boardDeck);
  });

});
