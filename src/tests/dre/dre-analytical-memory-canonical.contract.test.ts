import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

test('DRE Analytical Memory Canonical UI Contract', async (t) => {
  const filePath = path.resolve(process.cwd(), 'src/components/pages/dre/DRETechnicalLayerSection.tsx');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  await t.test('Should use exclusively Executive components in Memory mapping', () => {
    // Assert that we don't have bg-muted or rounded-lg capsules for the formula
    assert.ok(
      !fileContent.includes('bg-muted/30 p-2 rounded-lg'),
      'Must NOT use local bg-muted styling for formulas'
    );
    
    assert.ok(
      fileContent.includes('<ExecutiveSurface variant="transparent"') || fileContent.includes('<ExecutiveSurface variant="secondary"'),
      'Must use ExecutiveSurface for formula capsule'
    );
  });
});
