import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { normalizeTechnicalLayer } from '../../components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';

describe('BalanceSheetUIBinding - Normalization Contract', () => {

  it('Should correctly map legacy array binding to families', () => {
    const legacyArray = [
      { familyName: 'Liquidez', indicators: [{ label: 'Liquidez Corrente' }] }
    ];
    
    const result = normalizeTechnicalLayer(legacyArray);
    
    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].familyName, 'Liquidez');
  });

  it('Should correctly map canonical object binding to families', () => {
    const canonicalObject = {
      families: [
        { familyName: 'Estrutura de Capital', indicators: [{ label: 'Endividamento Geral' }] }
      ]
    };
    
    const result = normalizeTechnicalLayer(canonicalObject);
    
    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].familyName, 'Estrutura de Capital');
  });

  it('Should return empty array when no valid structure is provided', () => {
    assert.strictEqual(normalizeTechnicalLayer(null).length, 0);
    assert.strictEqual(normalizeTechnicalLayer(undefined).length, 0);
    assert.strictEqual(normalizeTechnicalLayer({}).length, 0);
    assert.strictEqual(normalizeTechnicalLayer('string').length, 0);
  });
});
