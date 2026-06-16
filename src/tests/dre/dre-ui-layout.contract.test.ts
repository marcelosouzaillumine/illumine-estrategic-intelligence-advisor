import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('DRE UI Layout Contract - Technical Layer', async (t) => {
  const filePath = path.join(process.cwd(), 'src/components/pages/dre/DRETechnicalLayerSection.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('Should not use aggressive background blocks on memory cards', () => {
    // Assert bg-surface-container/30 is removed from the memory cards section
    assert.ok(!content.includes('bg-surface-container/30 border border-border'), 'Memory cards must not use heavy backgrounds');
  });

  await t.test('Should enforce padding and gaps correctly', () => {
    assert.ok(content.includes('gap-6'), 'Must use gap-6 for breathing room');
    assert.ok(content.includes('bg-muted/20'), 'Must use subtle bg-muted/20 for internal blocks');
  });

  await t.test('Table should have muted headers or totals, not heavy backgrounds', () => {
    assert.ok(!content.includes("row.isTotal ? 'bg-surface-container' : ''"), 'Must not use heavy table rows');
    assert.ok(content.includes("row.isTotal ? 'bg-muted/10 font-medium' : ''"), 'Must use subtle muted row for totals');
  });
});
