import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('DFC Strict Domain Isolation Contract', () => {
  it('LegacyDFCAdapter não deve importar motores internos de DRE ou BP', () => {
    const adapterPath = path.join(__dirname, '../../runtime/adapters/LegacyDFCAdapter.ts');
    const content = fs.readFileSync(adapterPath, 'utf8');

    const blockedImports = [
      'calculateDreCascade',
      'buildBPHierarchy',
      'DRE_OFFICIAL_STRUCTURE'
    ];

    blockedImports.forEach(blocked => {
      assert.strictEqual(
        content.includes(blocked),
        false,
        `Vazamento de Domínio Detectado: LegacyDFCAdapter não deve conter a string '${blocked}'. Use DreCashEvidence ou BalanceSheetCashEvidence.`
      );
    });
  });
});
