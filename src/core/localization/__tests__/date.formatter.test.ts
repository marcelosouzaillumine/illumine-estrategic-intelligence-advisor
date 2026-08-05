import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DateFormatter } from '../formatters/DateFormatter';

describe('DateFormatter', () => {
  const testDate = new Date('2026-08-03T20:40:00Z'); // Assuming GMT time for the test to avoid local time skew, but let's just test formatting structure.

  test('formats pt-BR date correctly in executive format', () => {
    const result = DateFormatter.format(testDate, { locale: 'pt-BR', currency: 'BRL', timezone: 'UTC' });
    // pt-BR: DD/MM/YYYY HH:MM
    assert.match(result, /03\/08\/2026(,|) 20:40/);
  });

  test('formats en-US date correctly in executive format', () => {
    const result = DateFormatter.format(testDate, { locale: 'en-US', currency: 'USD', timezone: 'UTC' });
    // en-US: Aug 3, 2026, 8:40 PM
    assert.match(result, /Aug 0?3, 2026, 8:40\s*(PM|p\.m\.)/i);
  });
});
