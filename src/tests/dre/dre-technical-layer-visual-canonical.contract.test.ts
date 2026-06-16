import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('DRE Technical Layer Visual Canonical', async (t) => {
  const filePath = path.join(process.cwd(), 'src/components/pages/dre/DRETechnicalLayerSection.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('ausência de orange|amber|bg-orange|bg-amber', () => {
    assert.ok(!content.includes('bg-orange'), 'Should not contain bg-orange');
    assert.ok(!content.includes('bg-amber'), 'Should not contain bg-amber');
    assert.ok(!content.includes('text-orange'), 'Should not contain text-orange');
    assert.ok(!content.includes('text-amber'), 'Should not contain text-amber');
  });

  await t.test('presença de Executive components', () => {
    assert.ok(content.includes('<ExecutiveSurface'), 'Should use ExecutiveSurface');
    assert.ok(content.includes('<ExecutiveHeading'), 'Should use ExecutiveHeading');
    assert.ok(content.includes('<ExecutiveText'), 'Should use ExecutiveText');
  });

  await t.test('ausência de rounded-full em badges locais', () => {
    assert.ok(!content.includes('rounded-full'), 'Should not use local rounded-full badges');
  });

  await t.test('ausência de bg-primary e text-primary em containers e textos técnicos', () => {
    assert.ok(!content.includes('bg-primary'), 'Should not use bg-primary');
    assert.ok(!content.includes('text-primary'), 'Should not use text-primary');
  });
});
