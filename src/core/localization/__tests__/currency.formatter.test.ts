import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CurrencyFormatter } from '../formatters/CurrencyFormatter';

describe('CurrencyFormatter', () => {
  test('formats BRL correctly', () => {
    const result = CurrencyFormatter.format(1250000, { locale: 'pt-BR', currency: 'BRL', timezone: 'America/Sao_Paulo' });
    assert.ok(result.replace(/\u00A0/g, ' ').includes('R$'));
    assert.match(result, /1\.250\.000,00/);
  });

  test('formats USD correctly', () => {
    const result = CurrencyFormatter.format(250000, { locale: 'en-US', currency: 'USD', timezone: 'America/New_York' });
    assert.ok(result.includes('$'));
    assert.match(result, /250,000\.00/);
  });

  test('formats EUR correctly', () => {
    const result = CurrencyFormatter.format(250000, { locale: 'es-ES', currency: 'EUR', timezone: 'Europe/Madrid' });
    assert.match(result, /250\.000,00/);
    assert.ok(result.replace(/\u00A0/g, ' ').includes('€'));
  });
});
