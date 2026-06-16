import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('DRE Vocabulary Edge Containment Contract', async (t) => {
  const filePath = path.join(process.cwd(), 'src/components/pages/dre/DREBoardDecisionSupportSection.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('Must implement sanitizeDREText on the UI border', () => {
    assert.ok(content.includes('function sanitizeDREText'), 'Sanitize function must exist');
    assert.ok(content.includes('opinion={sanitizeDREText(vm.response)}'), 'Must sanitize response');
    assert.ok(content.includes('driver={sanitizeDREText(vm.rationale)}'), 'Must sanitize rationale');
    assert.ok(content.includes('action={sanitizeDREText(vm.recommendation)}'), 'Must sanitize recommendation');
  });

  await t.test('Must enforce strict vocabulary containment lists', () => {
    assert.ok(content.includes('DRE_ALLOWED_VOCABULARY'), 'Must contain allowed vocabulary definition');
    assert.ok(content.includes('DRE_FORBIDDEN_VOCABULARY'), 'Must contain forbidden vocabulary definition');
    assert.ok(content.includes('cisne negro'), 'Must forbid cisne negro');
    assert.ok(content.includes('market share'), 'Must forbid market share');
  });

  await t.test('Must gracefully degrade when unsupported inferences are detected', () => {
    assert.ok(content.includes('A análise deste painel deve permanecer restrita à formação do resultado, margens, custos, despesas e ponto de equilíbrio.'), 'Must include fallback text');
  });
});
