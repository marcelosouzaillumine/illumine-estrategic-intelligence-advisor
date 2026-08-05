import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreFormatter } from '../formatters/ScoreFormatter';

describe('ScoreFormatter', () => {
  test('formats simple score without scale', () => {
    const context = { locale: 'pt-BR' as any, currency: 'BRL' as 'BRL', timezone: 'America/Sao_Paulo' };
    const result = ScoreFormatter.format(87, context);
    assert.equal(result, '87');
  });

  test('formats score with scale', () => {
    const context = { locale: 'pt-BR' as any, currency: 'BRL' as 'BRL', timezone: 'America/Sao_Paulo' };
    const result = ScoreFormatter.format(87, context, { scale: 100 });
    assert.equal(result, '87/100');
  });

  test('rounds decimal scores', () => {
    const context = { locale: 'en-US' as any, currency: 'USD' as any, timezone: 'America/New_York' };
    const result = ScoreFormatter.format(87.6, context);
    assert.equal(result, '88');
  });
});
