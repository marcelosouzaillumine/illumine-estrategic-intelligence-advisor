import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('DRE Structural Table Canonical', async (t) => {
  const filePath = path.join(process.cwd(), 'src/components/pages/dre/DRETechnicalLayerSection.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('tabela usa ExecutiveTable', () => {
    assert.ok(content.includes('<ExecutiveTable'), 'Should use ExecutiveTable');
  });

  await t.test('não existe text-xs, font-bold, font-semibold local na tabela', () => {
    const tableSectionParts = content.split('<ExecutiveTable>');
    if (tableSectionParts.length > 1) {
      const tableSection = tableSectionParts[1];
      assert.ok(!tableSection.includes('text-xs'), 'Should not use text-xs locally');
      assert.ok(!tableSection.includes('font-bold'), 'Should not use font-bold locally');
      assert.ok(!tableSection.includes('font-semibold'), 'Should not use font-semibold locally');
    }
  });

  await t.test('não existe bg-muted/30 como solução visual principal', () => {
    assert.ok(!content.includes('bg-muted/30'), 'Should not use bg-muted/30');
  });
});
