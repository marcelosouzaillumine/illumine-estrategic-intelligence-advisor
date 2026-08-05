import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PercentageFormatter } from '../formatters/PercentageFormatter';

describe('PercentageFormatter', () => {
  test('formats BRL percentage correctly', () => {
    const result = PercentageFormatter.format(0.125, { locale: 'pt-BR', currency: 'BRL', timezone: 'America/Sao_Paulo' });
    assert.match(result, /12,5/);
    assert.ok(result.includes('%'));
  });

  test('formats USD percentage correctly', () => {
    const result = PercentageFormatter.format(0.125, { locale: 'en-US', currency: 'USD', timezone: 'America/New_York' });
    assert.match(result, /12.5/);
    assert.ok(result.includes('%'));
  });
});
